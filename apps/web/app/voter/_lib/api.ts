// API utilities for voter pages

import { getToken, LoginResponse } from "./auth";

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
    throw new ApiError(data.message || "Request failed", res.status);
  }

  return res.json();
}

// Auth API for voters
export const voterAuthApi = {
  login: (email: string, password: string) =>
    apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) =>
    apiRequest<LoginResponse>("/auth/register/voter", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getProfile: () =>
    apiRequest<{ user: { id: string; email: string; role: string; tenantId: string } }>("/auth/me"),
};

// Public session API (no auth required for info)
export const publicSessionApi = {
  getByToken: (publicToken: string) =>
    apiRequest<{
      id: string;
      title: string;
      description: string | null;
      deadline: string | null;
      status: string;
      defaultCredits: number;
      problemCount: number;
    }>(`/vote/session/${publicToken}`),

  join: (publicToken: string) =>
    apiRequest<{
      voterSession: {
        id: string;
        creditsAllowed: number;
        openedAt: string;
      };
      sessionId: string;
    }>(`/vote/session/${publicToken}/join`, {
      method: "POST",
    }),
};

// Voter sessions API (auth required)
export interface AssignedSession {
  id: string;
  sessionId: string;
  title: string;
  description: string | null;
  tenantName: string;
  status: string;
  deadline: string | null;
  problemCount: number;
  creditsAllowed: number;
  creditsUsed: number;
  openedAt: string | null;
  completedAt: string | null;
  assignedAt: string;
}

export interface VoterSessionDetail {
  session: {
    id: string;
    title: string;
    description: string | null;
    deadline: string | null;
    status: string;
  };
  voter: {
    email: string;
    name: string;
  };
  creditsAllowed: number;
  creditsUsed: number;
  creditsRemaining: number;
  openedAt: string | null;
  completedAt: string | null;
  problems: Array<{
    id: string;
    title: string;
    description: string | null;
    tags: string[];
    myVote?: {
      credits: number;
      comment: string | null;
    };
  }>;
}

export interface VoterSessionResults {
  session: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    deadline: string | null;
  };
  myVoting: {
    creditsAllowed: number;
    creditsUsed: number;
    completedAt: string | null;
    voteCount: number;
  };
  summary: {
    totalVoters: number;
    completedVoters: number;
    totalCreditsAllocated: number;
  };
  results: Array<{
    problem: {
      id: string;
      title: string;
      description: string | null;
      tags: string[];
    };
    totalCredits: number;
    voterCount: number;
    rank: number;
    myVote?: {
      credits: number;
      comment: string | null;
    };
  }>;
}

export const voterSessionsApi = {
  getAssigned: () =>
    apiRequest<AssignedSession[]>("/voter/sessions"),

  getDetail: (sessionId: string) =>
    apiRequest<VoterSessionDetail>(`/voter/sessions/${sessionId}`),

  getResults: (sessionId: string) =>
    apiRequest<VoterSessionResults>(`/voter/sessions/${sessionId}/results`),

  castVote: (sessionId: string, problemId: string, credits: number) =>
    apiRequest<{ vote: { id: string; credits: number } }>(`/voter/sessions/${sessionId}/vote`, {
      method: "POST",
      body: JSON.stringify({ problemId, credits }),
    }),

  castBulkVotes: (sessionId: string, votes: Array<{ problemId: string; credits: number }>) =>
    apiRequest<Array<{ vote: { id: string; credits: number } }>>(`/voter/sessions/${sessionId}/votes`, {
      method: "POST",
      body: JSON.stringify({ votes }),
    }),

  markComplete: (sessionId: string) =>
    apiRequest<{ voterSession: { completedAt: string } }>(`/voter/sessions/${sessionId}/complete`, {
      method: "POST",
    }),
};
