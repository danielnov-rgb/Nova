// API utilities for admin dashboard

import { getToken } from "./auth";
import {
  VotingSessionListItem,
  VotingSession,
  VotingLink,
  Problem,
  SessionResults,
  CreateSessionDto,
  UpdateSessionDto,
  CreateLinkDto,
  LoginResponse,
  SessionVotersResponse,
  VoterDetailResponse,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const url = `${API_URL}${endpoint}`;

  console.log(`[API] ${options.method || "GET"} ${url}`, token ? "(authenticated)" : "(no token)");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.error(`[API] Error ${res.status}:`, data);
    throw new ApiError(data.message || "Request failed", res.status);
  }

  return res.json();
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getProfile: () =>
    apiRequest<{ user: { id: string; email: string; role: string; tenantId: string } }>("/auth/me"),
};

// Sessions API
export const sessionsApi = {
  list: () => apiRequest<VotingSessionListItem[]>("/voting/sessions"),

  get: (id: string) => apiRequest<VotingSession>(`/voting/sessions/${id}`),

  create: (data: CreateSessionDto) =>
    apiRequest<VotingSession>("/voting/sessions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateSessionDto) =>
    apiRequest<VotingSession>(`/voting/sessions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getResults: (id: string) =>
    apiRequest<SessionResults>(`/voting/sessions/${id}/results`),
};

// Links API
export const linksApi = {
  list: (sessionId: string) =>
    apiRequest<VotingLink[]>(`/voting/sessions/${sessionId}/links`),

  create: (sessionId: string, data: CreateLinkDto) =>
    apiRequest<VotingLink>(`/voting/sessions/${sessionId}/links`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createBulk: (sessionId: string, links: CreateLinkDto[]) =>
    apiRequest<VotingLink[]>(`/voting/sessions/${sessionId}/links/bulk`, {
      method: "POST",
      body: JSON.stringify({ links }),
    }),
};

// Problems API
export const problemsApi = {
  list: (params?: { status?: string; search?: string }) => {
    const query = params
      ? new URLSearchParams(
          Object.entries(params).filter(([, v]) => v) as [string, string][]
        ).toString()
      : "";
    return apiRequest<Problem[]>(`/problems${query ? `?${query}` : ""}`);
  },

  get: (id: string) => apiRequest<Problem>(`/problems/${id}`),
};

// Voters API (Admin view of session voters)
export const votersApi = {
  list: (sessionId: string) =>
    apiRequest<SessionVotersResponse>(`/voting/sessions/${sessionId}/voters`),

  getDetail: (sessionId: string, voterId: string) =>
    apiRequest<VoterDetailResponse>(`/voting/sessions/${sessionId}/voters/${voterId}`),
};
