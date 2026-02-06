// Authentication utilities for voter pages

export interface VoterUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  tenantId: string;
}

export interface LoginResponse {
  accessToken: string;
  user: VoterUser;
}

const TOKEN_KEY = "nova_voter_token";
const USER_KEY = "nova_voter_user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): VoterUser | null {
  if (typeof window === "undefined") return null;
  const userData = localStorage.getItem(USER_KEY);
  if (!userData) return null;
  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
}

export function setAuth(data: LoginResponse): void {
  localStorage.setItem(TOKEN_KEY, data.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
