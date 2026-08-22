let accessToken: string | null = null;
const listeners = new Set<() => void>();

function emitChange(): void {
  listeners.forEach((listener) => listener());
}

export function setAccessToken(token: string): void {
  accessToken = token;
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
  emitChange();
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function clearAccessToken(): void {
  accessToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
  emitChange();
}

export function subscribeToAccessToken(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

export function clearLegacyPersistentAccessToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
}
