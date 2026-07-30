/**
 * lib/auth.ts
 *
 * Pure auth API functions — no React, no side effects.
 * Each function maps 1:1 to a backend endpoint.
 * The AuthContext and page components call these.
 *
 * Token storage:
 *   accessToken  → in-memory only
 *   refreshToken → HttpOnly cookie
 *
 * Security:
 *   - Tokens are written/cleared only through saveTokens() / clearTokens()
 *   - Raw tokens never logged
 *   - Password fields never logged
 */

import { refreshAccessTokenOnce, request } from "./api";
import {
  clearAccessToken,
  getAccessToken as readAccessToken,
  setAccessToken,
} from "./access-token-store";

// ── Token helpers ─────────────────────────────────────────────────────────────

export function saveTokens(accessToken: string): void {
  setAccessToken(accessToken);
}

export function clearTokens(): void {
  clearAccessToken();
}

export function getAccessToken(): string | null {
  return readAccessToken();
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
  verificationToken?: string;
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

export interface PassengerOtpVerifyResponse {
  success: boolean;
  message: string;
  user: Record<string, unknown>;
  accessToken: string;
  activeRole: "passenger";
  passwordSetupRequired: boolean;
}

// ── Passenger OTP authentication ─────────────────────────────────────────────

/**
 * Request the OTP used for frictionless passenger authentication.
 * The backend intentionally returns the same message for new and existing users.
 */
export async function sendPassengerAuthOTP(
  phone: string
): Promise<{ success: boolean; message: string }> {
  return request("/api/auth/passenger/sendOTP", {
    method: "POST",
    body: { phone },
    skipAuth: true,
  });
}

/**
 * Verify a passenger OTP, save the resulting access token, and return the
 * onboarding hint. Password setup is optional and never blocks checkout.
 */
export async function verifyPassengerAuthOTP(
  phone: string,
  otp: string
): Promise<PassengerOtpVerifyResponse> {
  const data = await request<PassengerOtpVerifyResponse>(
    "/api/auth/passenger/verifyOTP",
    {
      method: "POST",
      body: { phone, otp },
      skipAuth: true,
    }
  );

  if (data.accessToken) {
    saveTokens(data.accessToken);
  }

  return data;
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
  gender: "male" | "female" | "other";
  email?: string;
  referralCode?: string;
  verificationToken?: string;
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
 * On success, keeps the access token in memory and returns the full response.
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
 * Restore or rotate the session through the HttpOnly refresh cookie.
 * Concurrent callers share the API client's single refresh request.
 */
export async function refreshAccessToken(): Promise<RefreshResponse | null> {
  const accessToken = await refreshAccessTokenOnce();
  return accessToken ? { success: true, accessToken } : null;
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
