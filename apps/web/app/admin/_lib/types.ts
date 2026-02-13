// TypeScript interfaces for admin dashboard

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: "FDE" | "ADMIN" | "MEMBER" | "VOTER";
  tenantId: string;
  isDemoMode?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export type SessionStatus = "DRAFT" | "ACTIVE" | "CLOSED" | "ARCHIVED";

export interface VotingSessionListItem {
  id: string;
  title: string;
  status: SessionStatus;
  deadline: string | null;
  problemCount: number;
  voteCount: number;
  linkCount: number;
  createdAt: string;
}

export interface VotingSessionProblem {
  id: string;
  title: string;
  description?: string;
  preScore?: number;
  totalCredits: number;
  voterCount: number;
}

export interface VotingSession {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  status: SessionStatus;
  config: Record<string, unknown>;
  isPublic: boolean;
  publicToken?: string;
  defaultCredits: number;
  createdAt: string;
  problems: VotingSessionProblem[];
}

export interface VotingLink {
  id: string;
  token: string;
  email: string;
  creditsAllowed: number;
  expiresAt?: string;
  usedAt?: string;
  votingUrl: string;
  createdAt: string;
}

export interface ScoreWithMeta {
  value: number;
  justification?: string;
  source?: string;
  confidence?: number;
  aiSuggested?: number;
  lastUpdatedAt?: string;
  lastUpdatedBy?: string;
}

export interface Problem {
  id: string;
  title: string;
  description?: string;
  hypothesis?: string;
  source: string;
  evidenceItems?: Array<{
    id: string;
    type: string;
    content: string;
    source: string;
    sourceUrl?: string;
    reportedBy?: string;
    reportedAt?: string;
    sentiment?: string;
    weight?: number;
  }>;
  evidenceSummary?: string;
  scores: Record<string, ScoreWithMeta>;
  priorityScore?: number;
  status: string;
  tags: string[];
  sprintId?: string;
  groupIds?: string[];
  createdAt: string;
}

export interface VoteDetail {
  credits: number;
  comment?: string;
  voter: {
    id: string;
    email: string;
    name: string;
  };
  votedAt: string;
}

export interface ProblemResult {
  problem: {
    id: string;
    title: string;
    description?: string;
    tags: string[];
  };
  totalCredits: number;
  voterCount: number;
  votes: VoteDetail[];
}

export interface SessionResults {
  session: {
    id: string;
    title: string;
    status: SessionStatus;
    deadline?: string;
  };
  linkStats: {
    total: number;
    used: number;
    unused: number;
  };
  totalVotes: number;
  totalCreditsUsed: number;
  results: ProblemResult[];
}

export interface RequiredInfoField {
  field: string;
  label: string;
  required: boolean;
}

export interface CreateSessionVoterDto {
  email: string;
  type: VoterGroupType;
}

export interface CreateSessionDto {
  title: string;
  description?: string;
  deadline?: string;
  problemIds: string[];
  voterGroupIds?: string[];
  sprintId?: string;
  sessionType?: "SPRINT_BASED" | "THEMATIC";
  defaultCredits?: number;
  isPublic?: boolean;
  voters?: CreateSessionVoterDto[];
  config?: {
    creditsByRole?: Record<string, number>;
    requiredFields?: RequiredInfoField[];
  };
}

export interface UpdateSessionDto {
  title?: string;
  description?: string;
  deadline?: string;
  status?: SessionStatus;
  isPublic?: boolean;
  defaultCredits?: number;
}

export interface CreateLinkDto {
  email: string;
  creditsAllowed: number;
  expiresAt?: string;
}

// Voter types for admin view
export interface SessionVoter {
  id: string;
  type: "public" | "link";
  email: string;
  name: string | null;
  userId: string | null;
  creditsAllowed: number;
  creditsUsed: number;
  voteCount: number;
  openedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  token?: string;
  expiresAt?: string | null;
}

export interface SessionVotersResponse {
  session: {
    id: string;
    title: string;
    status: SessionStatus;
    isPublic: boolean;
  };
  summary: {
    totalVoters: number;
    publicVoters: number;
    linkVoters: number;
    completedCount: number;
    openedCount: number;
  };
  voters: SessionVoter[];
}

export interface VoterProblemVote {
  id: string;
  title: string;
  description: string | null;
  vote: {
    credits: number;
    comment: string | null;
    votedAt: string;
  } | null;
}

export interface VoterDetailResponse {
  voter: {
    id: string;
    type: "public" | "link";
    email: string;
    name: string | null;
    creditsAllowed: number;
    openedAt: string | null;
    completedAt: string | null;
    createdAt: string;
  };
  session: {
    id: string;
    title: string;
    status: SessionStatus;
  };
  summary: {
    creditsAllowed: number;
    creditsUsed: number;
    creditsRemaining: number;
    voteCount: number;
    problemCount: number;
  };
  problems: VoterProblemVote[];
}

// Voter Group types
export type VoterGroupType = "LEADERSHIP" | "PROJECT_TEAM" | "EXTERNAL_USER";

export interface VoterGroup {
  id: string;
  tenantId: string;
  name: string;
  type: VoterGroupType;
  description?: string;
  defaultCredits: number;
  createdAt: string;
  updatedAt: string;
  teamCodes?: TeamCode[];
  _count?: {
    memberships: number;
    teamCodes: number;
    sessionGroups?: number;
    votes?: number;
  };
}

export interface TeamCode {
  id: string;
  voterGroupId: string;
  code: string;
  description?: string;
  maxUses?: number;
  usesCount: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  voterGroup?: {
    id: string;
    name: string;
    type: VoterGroupType;
  };
  _count?: {
    redemptions: number;
  };
}

export interface VoterGroupMember {
  id: string;
  userId: string;
  voterGroupId: string;
  joinedVia: "TEAM_CODE" | "EMAIL_LINK" | "ADMIN_ADD" | "PUBLIC";
  joinedAt: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
  };
}

export interface CreateVoterGroupDto {
  name: string;
  type: VoterGroupType;
  description?: string;
  defaultCredits?: number;
}

export interface UpdateVoterGroupDto {
  name?: string;
  type?: VoterGroupType;
  description?: string;
  defaultCredits?: number;
}

export interface CreateTeamCodeDto {
  code: string;
  description?: string;
  maxUses?: number;
  expiresAt?: string;
}

export interface UpdateTeamCodeDto {
  description?: string;
  maxUses?: number;
  expiresAt?: string;
  isActive?: boolean;
}

// Sprint types
export type SprintStatus = "PLANNING" | "ACTIVE" | "COMPLETED" | "ARCHIVED";

export interface Sprint {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status: SprintStatus;
  createdAt: string;
  updatedAt: string;
  problems?: {
    id: string;
    title: string;
    status: string;
    tags: string[];
    createdAt: string;
  }[];
  votingSessions?: {
    id: string;
    title: string;
    status: SessionStatus;
    createdAt: string;
  }[];
  _count?: {
    problems: number;
    votingSessions: number;
  };
}

export interface CreateSprintDto {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: SprintStatus;
}

export interface UpdateSprintDto {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: SprintStatus;
}

export interface AssignProblemsDto {
  problemIds: string[];
}
