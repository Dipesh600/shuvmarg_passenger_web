/**
 * lib/api.ts
 *
 * Centralized HTTP client for all backend API calls.
 *
 * Responsibilities:
 *  - Prepend base URL from NEXT_PUBLIC_API_URL (never hardcoded)
 *  - Attach Authorization header from localStorage when a token exists
 *  - Always send X-App-Source: passenger (required by multi-role backend)
 *  - Normalize API errors into a consistent { message, errorCode } shape
 *
 * Security notes:
 *  - Tokens are read lazily (at call time) — never captured at module init
 *  - No automatic retry/refresh here; the AuthContext handles token rotation
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function getBaseUrl(): string {
  if (!BASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured. Set it before making API requests."
    );
  }

  return BASE_URL.replace(/\/+$/, "");
}

export interface ApiError {
  message: string;
  errorCode?: string;
  retryAfterMinutes?: number;
  retryAfterSeconds?: number;
  statusCode: number;
}

/** Thrown by `request()` on non-2xx responses. */
export class ApiRequestError extends Error {
  errorCode?: string;
  retryAfterMinutes?: number;
  retryAfterSeconds?: number;
  statusCode: number;

  constructor(info: ApiError) {
    super(info.message);
    this.name = "ApiRequestError";
    this.errorCode = info.errorCode;
    this.retryAfterMinutes = info.retryAfterMinutes;
    this.retryAfterSeconds = info.retryAfterSeconds;
    this.statusCode = info.statusCode;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** Override the Authorization token (e.g. for refresh with old token) */
  token?: string | null;
  /** Skip attaching Authorization header entirely */
  skipAuth?: boolean;
}

/**
 * Core request function. Builds the fetch call, handles errors uniformly.
 *
 * @param path - Relative path, e.g. "/api/sendPhoneOTP"
 * @param options - Method, body, auth overrides
 */
export async function request<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, skipAuth = false } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-App-Source": "passenger",
  };

  if (!skipAuth) {
    // Read at call time — never at module init — so hot token changes are respected
    const token =
      options.token !== undefined
        ? options.token
        : typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${getBaseUrl()}${path}`, {
    method,
    headers,
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Try to parse body regardless of status — backend always sends JSON
  let data: Record<string, unknown> = {};
  try {
    data = await response.json();
  } catch {
    // Non-JSON response (e.g. network error proxied as HTML) — treat as 500
  }

  if (!response.ok) {
    throw new ApiRequestError({
      message:
        (data.message as string) ||
        (data.error as string) ||
        "Something went wrong. Please try again.",
      errorCode: data.errorCode as string | undefined,
      retryAfterMinutes: data.retryAfterMinutes as number | undefined,
      retryAfterSeconds: data.retryAfterSeconds as number | undefined,
      statusCode: response.status,
    });
  }

  return data as T;
}
