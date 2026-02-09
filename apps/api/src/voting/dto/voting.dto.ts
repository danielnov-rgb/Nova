import {
  IsString,
  IsOptional,
  IsArray,
  IsEmail,
  IsNumber,
  IsDateString,
  IsBoolean,
  Min,
  IsObject,
} from 'class-validator';

// Voting Session DTOs
export class CreateVotingSessionDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  deadline?: string;

  @IsArray()
  @IsString({ each: true })
  problemIds: string[]; // Problems to include in this session

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  voterGroupIds?: string[]; // Voter groups allowed to participate

  @IsString()
  @IsOptional()
  sprintId?: string; // Optional sprint association

  @IsString()
  @IsOptional()
  sessionType?: 'SPRINT_BASED' | 'THEMATIC'; // Session type

  @IsObject()
  @IsOptional()
  config?: {
    creditsByRole?: Record<string, number>; // e.g., { CEO: 50, MEMBER: 10 }
  };

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean; // Allow public registration via shareable link

  @IsNumber()
  @IsOptional()
  @Min(1)
  defaultCredits?: number; // Default credits for public voters
}

export class UpdateVotingSessionDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  deadline?: string;

  @IsString()
  @IsOptional()
  status?: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED';

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(1)
  defaultCredits?: number;
}

// Voting Link DTOs (for FDE to create invite links)
export class CreateVotingLinkDto {
  @IsEmail()
  email: string;

  @IsNumber()
  @Min(1)
  creditsAllowed: number;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}

export class CreateBulkVotingLinksDto {
  @IsArray()
  links: CreateVotingLinkDto[];
}

// Vote DTOs
export class CastVoteDto {
  @IsString()
  problemId: string;

  @IsNumber()
  @Min(0)
  credits: number;

  @IsString()
  @IsOptional()
  comment?: string;
}

export class CastBulkVotesDto {
  @IsArray()
  votes: CastVoteDto[];
}

// Response DTOs
export class VotingSessionResponseDto {
  id: string;
  title: string;
  description?: string;
  deadline?: Date;
  status: string;
  config: Record<string, any>;
  createdAt: Date;
  problems: {
    id: string;
    title: string;
    description?: string;
    preScore?: number;
    totalCredits: number;
    voterCount: number;
  }[];
}

export class VotingLinkResponseDto {
  id: string;
  token: string;
  email: string;
  creditsAllowed: number;
  expiresAt?: Date;
  usedAt?: Date;
  votingUrl: string;
}

export class VoterSessionDto {
  session: {
    id: string;
    title: string;
    description?: string;
    deadline?: Date;
  };
  creditsAllowed: number;
  creditsUsed: number;
  creditsRemaining: number;
  problems: {
    id: string;
    title: string;
    description?: string;
    evidence: Record<string, any>;
    scores: Record<string, number>;
    tags: string[];
    myVote?: {
      credits: number;
      comment?: string;
    };
  }[];
}
