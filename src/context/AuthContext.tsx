"use client";

/**
 * context/AuthContext.tsx
 *
 * App-wide auth state management.
 *
 * Provides:
 *   user         — decoded JWT payload (or null if not logged in)
 *   isAuthenticated — boolean convenience flag
 *   isLoading    — true during initial token validation on mount
 *   login()      — wraps auth.login, updates context state
 *   logout()     — wraps auth.logout, clears state
 *   refreshSession() — called by API client on 401 to attempt silent renewal
 *
 * Design:
 *   - We decode the JWT locally (no extra API call) to get user info.
 *   - We do NOT verify the JWT signature client-side (that's the server's job).
 *   - On mount, a missing or expired in-memory access token is restored through
 *     the HttpOnly refresh cookie.
 *   - Token expiry is checked via `exp` claim (standard JWT field).
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  login as authLogin,
  logout as authLogout,
  refreshAccessToken,
  getAccessToken,
  clearTokens,
  verifyPassengerAuthOTP,
} from "@/lib/auth";
import { clearLegacyPersistentAccessToken } from "@/lib/access-token-store";

import { useToast } from "@/context/ToastContext";

// ── Payload type (mirrors what backend puts in the JWT) ───────────────────────

export interface AuthUser {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  role: string;
  activeRole: string;
  roles: string[];
  isVerified: boolean;
  exp: number; // Unix timestamp
}

// ── Context shape ─────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    phoneOrEmail: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  authenticatePassengerWithOtp: (
    phone: string,
    otp: string
  ) => Promise<{
    success: boolean;
    message: string;
    passwordSetupRequired: boolean;
  }>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Decode a JWT payload without verifying the signature. */
function decodeJwtPayload(token: string): AuthUser | null {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    // atob is safe here — we control what's in the token (our own backend)
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as AuthUser;
  } catch {
    return null;
  }
}

/** True if the decoded token's exp is in the past (with 30s buffer). */
function isTokenExpired(user: AuthUser): boolean {
  return user.exp * 1000 < Date.now() + 30_000;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  // ── Silent session restoration on mount ────────────────────────────────────
  useEffect(() => {
    async function restoreSession() {
      clearLegacyPersistentAccessToken();
      const token = getAccessToken();

      if (token) {
        const decoded = decodeJwtPayload(token);
        if (decoded && !isTokenExpired(decoded)) {
          setUser(decoded);
          setIsLoading(false);
          return;
        }
        clearTokens();
      }

      // Restore from the HttpOnly refresh cookie. This also supports a full
      // page reload now that access tokens are intentionally memory-only.
      const refreshed = await refreshAccessToken();
      if (refreshed?.accessToken) {
        const freshDecoded = decodeJwtPayload(refreshed.accessToken);
        setUser(freshDecoded);
      } else {
        setUser(null);
      }

      setIsLoading(false);
    }

    restoreSession();
  }, []);

  // ── Actions ─────────────────────────────────────────────────────────────────

  const login = useCallback(
    async (
      phoneOrEmail: string,
      password: string
    ): Promise<{ success: boolean; message: string }> => {
      try {
        const data = await authLogin(phoneOrEmail, password);

        if (data.success && data.accessToken) {
          const decoded = decodeJwtPayload(data.accessToken);
          setUser(decoded);
          showToast(data.message || "Logged in successfully!", "success");
          return { success: true, message: data.message };
        }

        const msg = data.message || "Login failed. Please check your credentials.";
        showToast(msg, "error");
        return {
          success: false,
          message: msg,
        };
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Login failed. Please try again.";
        showToast(message, "error");
        return { success: false, message };
      }
    },
    [showToast]
  );

  const logout = useCallback(async () => {
    await authLogout();
    setUser(null);
    showToast("You have been logged out successfully.", "info");
  }, [showToast]);

  const authenticatePassengerWithOtp = useCallback(
    async (phone: string, otp: string) => {
      try {
        const result = await verifyPassengerAuthOTP(phone, otp);
        const decoded = decodeJwtPayload(result.accessToken);

        if (!decoded) {
          clearTokens();
          const errMsg = "The login session could not be started. Please try again.";
          showToast(errMsg, "error");
          return {
            success: false,
            message: errMsg,
            passwordSetupRequired: false,
          };
        }

        setUser(decoded);
        showToast(result.message || "Phone verified! You are now logged in.", "success");
        return {
          success: true,
          message: result.message,
          passwordSetupRequired: result.passwordSetupRequired,
        };
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "OTP verification failed. Please try again.";
        showToast(message, "error");
        return {
          success: false,
          message,
          passwordSetupRequired: false,
        };
      }
    },
    [showToast]
  );

  /**
   * Called by the API client when it receives a 401.
   * Returns true if a new token was obtained, false if re-login is needed.
   */
  const refreshSession = useCallback(async (): Promise<boolean> => {
    const result = await refreshAccessToken();
    if (result?.accessToken) {
      const decoded = decodeJwtPayload(result.accessToken);
      setUser(decoded);
      return true;
    }
    setUser(null);
    return false;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      logout,
      refreshSession,
      authenticatePassengerWithOtp,
    }),
    [
      user,
      isLoading,
      login,
      logout,
      refreshSession,
      authenticatePassengerWithOtp,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
