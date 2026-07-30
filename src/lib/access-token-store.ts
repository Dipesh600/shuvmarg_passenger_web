let accessToken: string | null = null;

export function setAccessToken(token: string): void {
  accessToken = token;
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function clearAccessToken(): void {
  accessToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
}

export function clearLegacyPersistentAccessToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
}
