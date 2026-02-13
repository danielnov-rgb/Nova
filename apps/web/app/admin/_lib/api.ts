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
  VoterGroup,
  TeamCode,
  VoterGroupMember,
  CreateVoterGroupDto,
  UpdateVoterGroupDto,
  CreateTeamCodeDto,
  UpdateTeamCodeDto,
  Sprint,
  CreateSprintDto,
  UpdateSprintDto,
  AssignProblemsDto,
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

// Types for group results
export interface GroupRanking {
  problemId: string;
  title: string;
  totalCredits: number;
  weightedCredits: number;
  voterCount: number;
  rank: number;
}

export interface GroupResult {
  group: {
    id: string;
    name: string;
    type: string;
    weight: number;
  };
  totalVoters: number;
  totalVotes: number;
  totalCredits: number;
  rankings: GroupRanking[];
}

export interface ResultsByGroup {
  session: {
    id: string;
    title: string;
    status: string;
  };
  groups: GroupResult[];
}

export interface ConsensusAnalysis {
  session: {
    id: string;
    title: string;
    status: string;
  };
  hasMultipleGroups: boolean;
  groupCount?: number;
  consensus: {
    problem: { id: string; title: string };
    avgRank: number;
    agreement: string;
    ranksByGroup: { groupId: string; groupName: string; rank: number; credits: number }[];
  }[];
  conflicts: {
    problem: { id: string; title: string };
    avgRank: number;
    rankDiff: number;
    ranksByGroup: { groupId: string; groupName: string; rank: number; credits: number }[];
  }[];
}

export interface ParticipationStats {
  session: {
    id: string;
    title: string;
    status: string;
  };
  groups: {
    group: { id: string; name: string; type: string };
    totalMembers: number;
    votersParticipated: number;
    participationRate: number;
    totalVotes: number;
    totalCreditsUsed: number;
  }[];
}

export interface SessionGroup {
  id: string;
  name: string;
  type: string;
  weight: number;
  defaultCredits: number;
}

export interface SessionVoter {
  id: string;
  type: "public" | "link" | "group";
  email: string;
  name: string | null;
  userId: string | null;
  groupName?: string;
  creditsAllowed: number;
  creditsUsed: number;
  voteCount: number;
  openedAt: string | null;
  completedAt: string | null;
  createdAt: string | null;
  token?: string;
  expiresAt?: string | null;
}

export interface SessionVotersResponse {
  session: {
    id: string;
    title: string;
    status: string;
    isPublic: boolean;
  };
  summary: {
    totalVoters: number;
    groupVoters: number;
    publicVoters: number;
    linkVoters: number;
    completedCount: number;
    openedCount: number;
  };
  voters: SessionVoter[];
}

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

  getResultsByGroup: (id: string) =>
    apiRequest<ResultsByGroup>(`/voting/sessions/${id}/results/by-group`),

  getConsensusAnalysis: (id: string) =>
    apiRequest<ConsensusAnalysis>(`/voting/sessions/${id}/results/consensus`),

  getParticipationStats: (id: string) =>
    apiRequest<ParticipationStats>(`/voting/sessions/${id}/participation`),

  getSessionGroups: (id: string) =>
    apiRequest<SessionGroup[]>(`/voting/sessions/${id}/groups`),

  getVoters: (id: string) =>
    apiRequest<SessionVotersResponse>(`/voting/sessions/${id}/voters`),
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

// CSV Import types
export interface CsvParseResult {
  valid: boolean;
  rowCount: number;
  errors: { row: number; field: string; message: string }[];
  warnings: { row: number; field: string; message: string }[];
  problems: {
    row: number;
    title: string;
    description?: string;
    tags: string[];
    evidence: Record<string, any>;
    scores: Record<string, number>;
  }[];
}

export interface CsvImportResult {
  imported: number;
  warnings: { row: number; field: string; message: string }[];
}

// Excel Import types
export interface ExcelParseResult {
  valid: boolean;
  rowCount: number;
  headers: string[];
  errors: { row: number; field: string; message: string }[];
  warnings: { row: number; field: string; message: string }[];
  problems: {
    row: number;
    title: string;
    description?: string;
    rawData: Record<string, any>;
  }[];
}

export interface ExcelImportResult {
  imported: number;
  enriched: number;
  warnings: { row: number; field: string; message: string }[];
}

// FormData API request helper for file uploads
async function apiRequestFormData<T>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  const token = getToken();
  const url = `${API_URL}${endpoint}`;

  console.log(`[API] POST ${url} (FormData)`, token ? "(authenticated)" : "(no token)");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.error(`[API] Error ${res.status}:`, data);
    throw new ApiError(data.message || "Request failed", res.status);
  }

  return res.json();
}

// Create/Update Problem DTOs
export interface CreateProblemDto {
  title: string;
  description?: string;
  tags?: string[];
  scores?: Record<string, number>;
  evidence?: Record<string, unknown>;
}

export interface UpdateProblemDto {
  title?: string;
  description?: string;
  status?: string;
  tags?: string[];
  scores?: Record<string, number>;
  evidence?: Record<string, unknown>;
}

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

  create: (data: CreateProblemDto) =>
    apiRequest<Problem>("/problems", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateProblemDto) =>
    apiRequest<Problem>(`/problems/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/problems/${id}`, {
      method: "DELETE",
    }),

  previewCsvImport: (csvContent: string) =>
    apiRequest<CsvParseResult>("/problems/import/csv/preview", {
      method: "POST",
      body: JSON.stringify({ csvContent }),
    }),

  importCsv: (csvContent: string, sprintId?: string) =>
    apiRequest<CsvImportResult>("/problems/import/csv", {
      method: "POST",
      body: JSON.stringify({ csvContent, sprintId }),
    }),

  previewExcelImport: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiRequestFormData<ExcelParseResult>("/problems/import/excel/preview", formData);
  },

  importExcel: (file: File, options?: { sprintId?: string; enrichWithAgent?: boolean }) => {
    const formData = new FormData();
    formData.append("file", file);
    if (options?.sprintId) {
      formData.append("sprintId", options.sprintId);
    }
    if (options?.enrichWithAgent) {
      formData.append("enrichWithAgent", "true");
    }
    return apiRequestFormData<ExcelImportResult>("/problems/import/excel", formData);
  },

  // Comments
  getComments: (problemId: string) =>
    apiRequest<CommentResponse[]>(`/problems/${problemId}/comments`),

  addComment: (problemId: string, content: string) =>
    apiRequest<CommentResponse>(`/problems/${problemId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),

  updateComment: (problemId: string, commentId: string, content: string) =>
    apiRequest<CommentResponse>(`/problems/${problemId}/comments/${commentId}`, {
      method: "PUT",
      body: JSON.stringify({ content }),
    }),

  deleteComment: (problemId: string, commentId: string) =>
    apiRequest<{ success: boolean }>(`/problems/${problemId}/comments/${commentId}`, {
      method: "DELETE",
    }),

  // Favourites
  getFavouriteStatus: (problemId: string) =>
    apiRequest<FavouriteStatusResponse>(`/problems/${problemId}/favourite`),

  addFavourite: (problemId: string) =>
    apiRequest<{ success: boolean; isFavourited: boolean }>(`/problems/${problemId}/favourite`, {
      method: "POST",
    }),

  removeFavourite: (problemId: string) =>
    apiRequest<{ success: boolean; isFavourited: boolean }>(`/problems/${problemId}/favourite`, {
      method: "DELETE",
    }),

  listFavourites: () => apiRequest<Problem[]>("/problems/favourites"),
};

// Comment & Favourite Types
export interface CommentResponse {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface FavouriteStatusResponse {
  isFavourited: boolean;
  favouriteCount: number;
  favouritedBy?: Array<{
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  }>;
}

// Voters API (Admin view of session voters)
export const votersApi = {
  list: (sessionId: string) =>
    apiRequest<SessionVotersResponse>(`/voting/sessions/${sessionId}/voters`),

  getDetail: (sessionId: string, voterId: string) =>
    apiRequest<VoterDetailResponse>(`/voting/sessions/${sessionId}/voters/${voterId}`),
};

// Voter Groups API
export const voterGroupsApi = {
  list: () => apiRequest<VoterGroup[]>("/voter-groups"),

  get: (id: string) => apiRequest<VoterGroup>(`/voter-groups/${id}`),

  create: (data: CreateVoterGroupDto) =>
    apiRequest<VoterGroup>("/voter-groups", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateVoterGroupDto) =>
    apiRequest<VoterGroup>(`/voter-groups/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/voter-groups/${id}`, {
      method: "DELETE",
    }),

  getMembers: (id: string) =>
    apiRequest<VoterGroupMember[]>(`/voter-groups/${id}/members`),

  createTeamCode: (groupId: string, data: CreateTeamCodeDto) =>
    apiRequest<TeamCode>(`/voter-groups/${groupId}/codes`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Team Codes API
export const teamCodesApi = {
  list: () => apiRequest<TeamCode[]>("/team-codes"),

  update: (id: string, data: UpdateTeamCodeDto) =>
    apiRequest<TeamCode>(`/team-codes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/team-codes/${id}`, {
      method: "DELETE",
    }),
};

// Sprints API
export const sprintsApi = {
  list: () => apiRequest<Sprint[]>("/sprints"),

  get: (id: string) => apiRequest<Sprint>(`/sprints/${id}`),

  create: (data: CreateSprintDto) =>
    apiRequest<Sprint>("/sprints", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateSprintDto) =>
    apiRequest<Sprint>(`/sprints/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/sprints/${id}`, {
      method: "DELETE",
    }),

  assignProblems: (id: string, data: AssignProblemsDto) =>
    apiRequest<Sprint>(`/sprints/${id}/problems`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  unassignProblems: (id: string, data: AssignProblemsDto) =>
    apiRequest<Sprint>(`/sprints/${id}/problems`, {
      method: "DELETE",
      body: JSON.stringify(data),
    }),

  getUnassignedProblems: () =>
    apiRequest<Problem[]>("/sprints/unassigned-problems"),
};

// Client Onboarding types
export interface ClientContext {
  id: string;
  tenantId: string;
  objectives?: string;
  businessModel?: string;
  competitiveAdvantages?: string;
  existingProblems?: string;
  designSystemUrl?: string;
  gitRepoUrl?: string;
  terminologyGlossary: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateClientContextDto {
  objectives?: string;
  businessModel?: string;
  competitiveAdvantages?: string;
  existingProblems?: string;
  designSystemUrl?: string;
  gitRepoUrl?: string;
  terminologyGlossary?: Record<string, string>;
}

// Onboarding API
export const onboardingApi = {
  get: () => apiRequest<ClientContext>("/onboarding"),

  update: (data: UpdateClientContextDto) =>
    apiRequest<ClientContext>("/onboarding", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getTerminology: () =>
    apiRequest<Record<string, string>>("/onboarding/terminology"),

  updateTerminology: (terminology: Record<string, string>) =>
    apiRequest<ClientContext>("/onboarding/terminology", {
      method: "PUT",
      body: JSON.stringify(terminology),
    }),

  addTerm: (term: string, definition: string) =>
    apiRequest<ClientContext>("/onboarding/terminology/term", {
      method: "POST",
      body: JSON.stringify({ term, definition }),
    }),

  removeTerm: (term: string) =>
    apiRequest<ClientContext>(`/onboarding/terminology/term/${encodeURIComponent(term)}`, {
      method: "DELETE",
    }),
};

// Target Audience types
export type TargetAudienceType = "EXISTING" | "TARGET" | "MARKET";

export interface SegmentDefinition {
  name: string;
  description?: string;
  demographics?: {
    ageRange?: string;
    location?: string;
    income?: string;
    profession?: string;
    industry?: string;
  };
  size?: number;
  notes?: string;
}

export interface TargetAudience {
  id: string;
  tenantId: string;
  name: string;
  type: TargetAudienceType;
  segments: SegmentDefinition[];
  targets: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAudienceDto {
  name: string;
  type: TargetAudienceType;
  description?: string;
  segments?: SegmentDefinition[];
  targets?: Record<string, number>;
}

export interface UpdateAudienceDto {
  name?: string;
  type?: TargetAudienceType;
  description?: string;
  segments?: SegmentDefinition[];
  targets?: Record<string, number>;
}

// Audience API
export const audienceApi = {
  list: (type?: TargetAudienceType) => {
    const query = type ? `?type=${type}` : "";
    return apiRequest<TargetAudience[]>(`/audience${query}`);
  },

  get: (id: string) => apiRequest<TargetAudience>(`/audience/${id}`),

  create: (data: CreateAudienceDto) =>
    apiRequest<TargetAudience>("/audience", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateAudienceDto) =>
    apiRequest<TargetAudience>(`/audience/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/audience/${id}`, {
      method: "DELETE",
    }),
};

// Market Intelligence types
export type MarketIntelligenceCategory = "INDUSTRY" | "BENCHMARK" | "ECONOMIC" | "PRICING" | "DEMOGRAPHIC";

export interface MarketIntelligence {
  id: string;
  tenantId: string;
  category: MarketIntelligenceCategory;
  title: string;
  value?: string;
  source?: string;
  notes?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMarketIntelligenceDto {
  category: MarketIntelligenceCategory;
  title: string;
  value?: string;
  source?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateMarketIntelligenceDto {
  category?: MarketIntelligenceCategory;
  title?: string;
  value?: string;
  source?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

// Market Intelligence API
export const marketApi = {
  list: (category?: MarketIntelligenceCategory) => {
    const query = category ? `?category=${category}` : "";
    return apiRequest<MarketIntelligence[]>(`/market${query}`);
  },

  get: (id: string) => apiRequest<MarketIntelligence>(`/market/${id}`),

  create: (data: CreateMarketIntelligenceDto) =>
    apiRequest<MarketIntelligence>("/market", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateMarketIntelligenceDto) =>
    apiRequest<MarketIntelligence>(`/market/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/market/${id}`, {
      method: "DELETE",
    }),
};

// Competitor types
export interface Competitor {
  id: string;
  tenantId: string;
  name: string;
  website?: string;
  description?: string;
  strengths: string[];
  weaknesses: string[];
  pricing: Record<string, unknown>;
  solutions: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompetitorDto {
  name: string;
  website?: string;
  description?: string;
  strengths?: string[];
  weaknesses?: string[];
  pricing?: Record<string, unknown>;
  solutions?: string[];
  notes?: string;
}

export interface UpdateCompetitorDto {
  name?: string;
  website?: string;
  description?: string;
  strengths?: string[];
  weaknesses?: string[];
  pricing?: Record<string, unknown>;
  solutions?: string[];
  notes?: string;
}

// Competitors API
export const competitorsApi = {
  list: () => apiRequest<Competitor[]>("/competitors"),

  get: (id: string) => apiRequest<Competitor>(`/competitors/${id}`),

  create: (data: CreateCompetitorDto) =>
    apiRequest<Competitor>("/competitors", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateCompetitorDto) =>
    apiRequest<Competitor>(`/competitors/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/competitors/${id}`, {
      method: "DELETE",
    }),
};

// Project Management types
export type ProjectItemStatus = "BACKLOG" | "IN_PROGRESS" | "REVIEW" | "DONE";

export interface ProjectItem {
  id: string;
  tenantId: string;
  problemId?: string;
  title: string;
  description?: string;
  status: ProjectItemStatus;
  priority: number;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectItemDto {
  title: string;
  description?: string;
  problemId?: string;
  status?: ProjectItemStatus;
  priority?: number;
  assignee?: string;
}

export interface UpdateProjectItemDto {
  title?: string;
  description?: string;
  problemId?: string;
  status?: ProjectItemStatus;
  priority?: number;
  assignee?: string;
}

export interface ProjectItemsByStatus {
  BACKLOG: ProjectItem[];
  IN_PROGRESS: ProjectItem[];
  REVIEW: ProjectItem[];
  DONE: ProjectItem[];
}

// Projects API
export const projectsApi = {
  list: (status?: ProjectItemStatus) => {
    const query = status ? `?status=${status}` : "";
    return apiRequest<ProjectItem[]>(`/projects${query}`);
  },

  getByStatus: () => apiRequest<ProjectItemsByStatus>("/projects/by-status"),

  get: (id: string) => apiRequest<ProjectItem>(`/projects/${id}`),

  create: (data: CreateProjectItemDto) =>
    apiRequest<ProjectItem>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateProjectItemDto) =>
    apiRequest<ProjectItem>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/projects/${id}`, {
      method: "DELETE",
    }),

  reorder: (items: { id: string; status: ProjectItemStatus; priority: number }[]) =>
    apiRequest<{ success: boolean }>("/projects/reorder", {
      method: "PUT",
      body: JSON.stringify({ items }),
    }),
};

// Feature Map types
export type FeatureStatus = "DRAFT" | "ACTIVE" | "DEPRECATED" | "ARCHIVED";

export interface CodeLocation {
  repo: string;
  filePath: string;
  lineRange?: string;
  branch?: string;
}

export interface DesignFile {
  url: string;
  type: string;
  name: string;
}

export interface Feature {
  id: string;
  tenantId: string;
  featureId: string;
  name: string;
  description?: string;
  status: FeatureStatus;
  parentId?: string;
  codeLocations: CodeLocation[];
  designFiles: DesignFile[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  children?: Feature[];
  parent?: Feature;
  _count?: {
    analyticsEvents: number;
    children: number;
  };
}

export interface CreateFeatureDto {
  featureId: string;
  name: string;
  description?: string;
  parentId?: string;
  status?: FeatureStatus;
  codeLocations?: CodeLocation[];
  designFiles?: DesignFile[];
  tags?: string[];
}

export interface UpdateFeatureDto {
  featureId?: string;
  name?: string;
  description?: string;
  parentId?: string;
  status?: FeatureStatus;
  codeLocations?: CodeLocation[];
  designFiles?: DesignFile[];
  tags?: string[];
}

// Features API
export const featuresApi = {
  list: (params?: { parentId?: string; status?: FeatureStatus; search?: string; rootOnly?: boolean }) => {
    const query = params
      ? new URLSearchParams(
          Object.entries(params)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => [k, String(v)])
        ).toString()
      : "";
    return apiRequest<Feature[]>(`/features${query ? `?${query}` : ""}`);
  },

  get: (id: string) => apiRequest<Feature>(`/features/${id}`),

  getByFeatureId: (featureId: string) =>
    apiRequest<Feature>(`/features/by-feature-id/${featureId}`),

  getTree: () => apiRequest<Feature[]>("/features/tree"),

  create: (data: CreateFeatureDto) =>
    apiRequest<Feature>("/features", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateFeatureDto) =>
    apiRequest<Feature>(`/features/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<Feature>(`/features/${id}`, {
      method: "DELETE",
    }),

  getEventCount: (id: string, days?: number) => {
    const query = days ? `?days=${days}` : "";
    return apiRequest<{ featureId: string; eventCount: number; days: number }>(
      `/features/${id}/events/count${query}`
    );
  },
};

// Plugin Config types
export interface PluginConfig {
  id: string;
  tenantId: string;
  apiKey: string;
  isEnabled: boolean;
  allowedOrigins: string[];
  eventsPerMinute: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePluginConfigDto {
  isEnabled?: boolean;
  allowedOrigins?: string[];
  eventsPerMinute?: number;
}

export interface AnalyticsStats {
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsByDay: { date: string; count: number }[];
  topFeatures: { featureId: string; name: string; count: number }[];
}

// Plugin API
export const pluginApi = {
  getConfig: () => apiRequest<PluginConfig>("/plugin/config"),

  updateConfig: (data: UpdatePluginConfigDto) =>
    apiRequest<PluginConfig>("/plugin/config", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  rotateApiKey: () =>
    apiRequest<{ apiKey: string; message: string }>("/plugin/config/rotate-key", {
      method: "POST",
    }),

  getAnalytics: (days?: number) => {
    const query = days ? `?days=${days}` : "";
    return apiRequest<AnalyticsStats>(`/plugin/analytics${query}`);
  },
};

// Solution Design types
export type SolutionStatus = "DESIGNED" | "DEVELOPMENT" | "TESTING" | "LIVE" | "KILLED";

export interface Solution {
  id: string;
  tenantId: string;
  problemId: string;
  title: string;
  description?: string;
  mockups: string[];
  assumptions: Record<string, unknown>;
  status: SolutionStatus;
  problem?: {
    id: string;
    title: string;
    description?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateSolutionDto {
  problemId: string;
  title: string;
  description?: string;
  mockups?: string[];
  assumptions?: Record<string, unknown>;
  status?: SolutionStatus;
}

export interface UpdateSolutionDto {
  title?: string;
  description?: string;
  mockups?: string[];
  assumptions?: Record<string, unknown>;
  status?: SolutionStatus;
}

// Solutions API
export const solutionsApi = {
  list: (status?: SolutionStatus) => {
    const query = status ? `?status=${status}` : "";
    return apiRequest<Solution[]>(`/solutions${query}`);
  },

  get: (id: string) => apiRequest<Solution>(`/solutions/${id}`),

  getByProblem: (problemId: string) =>
    apiRequest<Solution[]>(`/solutions/by-problem/${problemId}`),

  create: (data: CreateSolutionDto) =>
    apiRequest<Solution>("/solutions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateSolutionDto) =>
    apiRequest<Solution>(`/solutions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/solutions/${id}`, {
      method: "DELETE",
    }),
};

// Problem Group types
export interface ProblemGroup {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    problems: number;
  };
}

export interface CreateProblemGroupDto {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface UpdateProblemGroupDto {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface BulkGroupOperationDto {
  problemIds: string[];
  groupIds: string[];
}

// Problem Groups API
export const problemGroupsApi = {
  list: () => apiRequest<ProblemGroup[]>("/problem-groups"),

  get: (id: string) => apiRequest<ProblemGroup>(`/problem-groups/${id}`),

  create: (data: CreateProblemGroupDto) =>
    apiRequest<ProblemGroup>("/problem-groups", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateProblemGroupDto) =>
    apiRequest<ProblemGroup>(`/problem-groups/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/problem-groups/${id}`, {
      method: "DELETE",
    }),

  // Add problems to a group
  addProblems: (groupId: string, problemIds: string[]) =>
    apiRequest<{ added: number }>(`/problem-groups/${groupId}/problems`, {
      method: "POST",
      body: JSON.stringify({ problemIds }),
    }),

  // Remove problems from a group
  removeProblems: (groupId: string, problemIds: string[]) =>
    apiRequest<{ removed: number }>(`/problem-groups/${groupId}/problems`, {
      method: "DELETE",
      body: JSON.stringify({ problemIds }),
    }),

  // Get problems in a group
  getProblems: (groupId: string) =>
    apiRequest<Problem[]>(`/problem-groups/${groupId}/problems`),

  // Bulk operations
  bulkAdd: (data: BulkGroupOperationDto) =>
    apiRequest<{ added: number; problemCount: number; groupCount: number }>(
      "/problem-groups/bulk/add",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),

  bulkRemove: (data: BulkGroupOperationDto) =>
    apiRequest<{ removed: number }>("/problem-groups/bulk/remove", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
