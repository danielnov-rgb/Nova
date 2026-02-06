// TypeScript interfaces for admin dashboard

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: "FDE" | "ADMIN" | "MEMBER" | "VOTER";
  tenantId: string;
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

export interface Problem {
  id: string;
  title: string;
  description?: string;
  source: string;
  evidence: Record<string, unknown>;
  scores: Record<string, number>;
  status: string;
  tags: string[];
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

export interface CreateSessionDto {
  title: string;
  description?: string;
  deadline?: string;
  problemIds: string[];
  config?: {
    defaultCredits?: number;
    creditsByRole?: Record<string, number>;
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
