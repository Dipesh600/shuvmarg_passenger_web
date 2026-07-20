/**
 * lib/auth.ts
 *
 * Pure auth API functions — no React, no side effects.
 * Each function maps 1:1 to a backend endpoint.
 * The AuthContext and page components call these.
 *
 * Token storage:
 *   accessToken  → localStorage["accessToken"]
 *   refreshToken → localStorage["refreshToken"]
 *
 * Security:
 *   - Tokens are written/cleared only through saveTokens() / clearTokens()
 *   - Raw tokens never logged
 *   - Password fields never logged
 */

import { request } from "./api";

// ── Token helpers ─────────────────────────────────────────────────────────────

export function saveTokens(accessToken: string): void {
  localStorage.setItem("accessToken", accessToken);
}

export function clearTokens(): void {
  localStorage.removeItem("accessToken");
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

// refreshToken is stored in HttpOnly cookie now

// ── Response types ────────────────────────────────────────────────────────────

export interface SendOtpResponse {
  status: boolean;
  message: string;
  data?: { phone: string; expiresIn: string };
}

export interface VerifyOtpResponse {
  status: boolean;
  message: string;
}

export interface CompleteRegistrationResponse {
  status: boolean;
  message: string;
  data?: { userId: string; phone: string; email?: string };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: Record<string, unknown>;
  accessToken?: string;
  activeRole?: string;
  forcePasswordChange?: boolean;
  tempToken?: string;
}

export interface RefreshResponse {
  success: boolean;
  accessToken: string;
}

// ── Signup — 3-step OTP registration ─────────────────────────────────────────

/** Step 1: Send OTP to phone. Phone must NOT already exist in the system. */
export async function sendPhoneOTP(phone: string): Promise<SendOtpResponse> {
  return request<SendOtpResponse>("/api/sendPhoneOTP", {
    method: "POST",
    body: { phone },
    skipAuth: true,
  });
}

/** Step 2: Verify the OTP code. Must be called before completeRegistration. */
export async function verifyPhoneOTP(
  phone: string,
  otp: string
): Promise<VerifyOtpResponse> {
  return request<VerifyOtpResponse>("/api/verifyPhoneOTP", {
    method: "POST",
    body: { phone, otp },
    skipAuth: true,
  });
}

/** Step 3: Complete registration with full user details. */
export async function completeRegistration(payload: {
  phone: string;
  name: string;
  password: string;
  address: string;
  gender: "male" | "female";
  email?: string;
  referralCode?: string;
}): Promise<CompleteRegistrationResponse> {
  return request<CompleteRegistrationResponse>("/api/completeRegistration", {
    method: "POST",
    body: payload,
    skipAuth: true,
  });
}

// ── Login ─────────────────────────────────────────────────────────────────────

/**
 * Password login. Backend accepts phone or email as `emailOrPhone`.
 * On success, saves tokens to localStorage and returns the full response.
 */
export async function login(
  phoneOrEmail: string,
  password: string
): Promise<LoginResponse> {
  const data = await request<LoginResponse>("/api/login", {
    method: "POST",
    body: { emailOrPhone: phoneOrEmail, password },
    skipAuth: true,
  });

  if (data.accessToken) {
    saveTokens(data.accessToken);
  }

  return data;
}

// ── Session management ────────────────────────────────────────────────────────

/**
 * Exchange the stored refresh token for a new access + refresh token pair.
 * The old refresh token is invalidated (rotation). Saves new tokens.
 */
export async function refreshAccessToken(): Promise<RefreshResponse | null> {
  try {
    const data = await request<RefreshResponse>("/api/refresh", {
      method: "POST",
      skipAuth: true,
    });

    if (data.accessToken) {
      saveTokens(data.accessToken);
    }

    return data;
  } catch {
    // Refresh token is invalid or expired — force re-login
    clearTokens();
    return null;
  }
}

/**
 * Revoke the current refresh token on the server and clear local tokens.
 */
export async function logout(): Promise<void> {
  try {
    await request("/api/logout", {
      method: "POST",
    });
  } catch {
    // Even if the server call fails, we clear local tokens
  }
  
  clearTokens();
}

// ── Forgot Password — 3-step OTP reset ───────────────────────────────────────

/** Step 1: Send OTP to the phone associated with the account. */
export async function requestPasswordReset(
  emailOrPhone: string
): Promise<{ status: boolean; message: string }> {
  return request("/api/requestPasswordReset", {
    method: "POST",
    body: { emailOrPhone },
    skipAuth: true,
  });
}

/**
 * Step 2: Verify the OTP without marking it used yet.
 * (Backend marks it used when resetPassword is called with the same OTP.)
 */
export async function verifyOtpForReset(
  emailOrPhone: string,
  otp: string
): Promise<{ status: boolean; message: string }> {
  return request("/api/verifyOtpForReset", {
    method: "POST",
    body: { emailOrPhone, otp },
    skipAuth: true,
  });
}

/** Step 3: Set the new password. The OTP is verified + consumed in this call. */
export async function resetPassword(
  emailOrPhone: string,
  otp: string,
  newPassword: string
): Promise<{ status: boolean; message: string }> {
  return request("/api/resetPassword", {
    method: "POST",
    body: { emailOrPhone, otp, newPassword },
    skipAuth: true,
  });
}

// ── Resend OTP ────────────────────────────────────────────────────────────────

export async function resendOtp(
  phone: string,
  purpose: "REGISTRATION" | "PASSWORD_RESET"
): Promise<{ success: boolean; message: string; data?: { expiresIn: string } }> {
  return request("/api/resendOtp", {
    method: "POST",
    body: { phone, purpose },
    skipAuth: true,
  });
}
