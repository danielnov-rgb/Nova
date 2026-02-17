"""
Pydantic models matching Nova's EnhancedProblem type.
See: apps/web/app/admin/_lib/types/problem.ts
"""

from datetime import datetime
from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
import uuid


class ProblemSource(str, Enum):
    SYNTHETIC_INTERVIEW = "SYNTHETIC_INTERVIEW"
    MANUAL = "MANUAL"
    IMPORT = "IMPORT"
    RESEARCH = "RESEARCH"


class ProblemStatus(str, Enum):
    DISCOVERED = "DISCOVERED"
    SHORTLISTED = "SHORTLISTED"
    BACKLOG = "BACKLOG"
    IN_PROGRESS = "IN_PROGRESS"
    SOLVED = "SOLVED"
    DISCARDED = "DISCARDED"


class EvidenceType(str, Enum):
    INTERVIEW_QUOTE = "INTERVIEW_QUOTE"
    SURVEY_RESPONSE = "SURVEY_RESPONSE"
    SUPPORT_TICKET = "SUPPORT_TICKET"
    ANALYTICS_DATA = "ANALYTICS_DATA"
    MARKET_RESEARCH = "MARKET_RESEARCH"
    COMPETITOR_INTEL = "COMPETITOR_INTEL"
    EXPERT_OPINION = "EXPERT_OPINION"
    SYNTHETIC_INTERVIEW = "SYNTHETIC_INTERVIEW"
    OBSERVATION = "OBSERVATION"
    OTHER = "OTHER"


class Sentiment(str, Enum):
    POSITIVE = "POSITIVE"
    NEGATIVE = "NEGATIVE"
    NEUTRAL = "NEUTRAL"


class ScoreSource(str, Enum):
    AI = "AI"
    HUMAN = "HUMAN"
    IMPORT = "IMPORT"


class EvidenceItem(BaseModel):
    """A piece of evidence supporting a problem."""
    id: str = Field(default_factory=lambda: f"ev-{uuid.uuid4().hex[:8]}")
    type: EvidenceType = EvidenceType.OTHER
    content: str
    source: str  # Where it came from (e.g., "Sprint 1 Scoring Session")
    source_url: Optional[str] = None
    reported_by: Optional[str] = None
    reported_at: Optional[str] = None
    sentiment: Optional[Sentiment] = None
    weight: Optional[float] = Field(None, ge=0, le=1)
    metadata: Optional[Dict[str, Any]] = None


class ScoreWithMeta(BaseModel):
    """A score with metadata about how it was determined."""
    value: int = Field(ge=0, le=100)
    justification: Optional[str] = None
    source: ScoreSource = ScoreSource.AI
    ai_suggested: Optional[int] = None
    confidence: Optional[float] = Field(None, ge=0, le=1)
    last_updated_at: Optional[str] = None
    last_updated_by: Optional[str] = None


class ProblemScores(BaseModel):
    """11-dimensional scoring for a problem."""
    # Core attributes (40-50% weight)
    applicability: ScoreWithMeta = Field(
        default_factory=lambda: ScoreWithMeta(value=50),
        description="What % of target users are affected by this problem?"
    )
    severity: ScoreWithMeta = Field(
        default_factory=lambda: ScoreWithMeta(value=50),
        description="How painful is this problem when encountered?"
    )
    frequency: ScoreWithMeta = Field(
        default_factory=lambda: ScoreWithMeta(value=50),
        description="How often does this problem occur?"
    )
    willingness_to_pay: ScoreWithMeta = Field(
        default_factory=lambda: ScoreWithMeta(value=50),
        description="Would users pay to solve this problem?"
    )

    # Strategic attributes (30-40% weight)
    retention_impact: ScoreWithMeta = Field(
        default_factory=lambda: ScoreWithMeta(value=50),
        description="Does solving this improve user retention?"
    )
    acquisition_potential: ScoreWithMeta = Field(
        default_factory=lambda: ScoreWithMeta(value=50),
        description="Can this attract new users?"
    )
    viral_coefficient: ScoreWithMeta = Field(
        default_factory=lambda: ScoreWithMeta(value=50),
        description="Does this drive word-of-mouth growth?"
    )
    strategic_fit: ScoreWithMeta = Field(
        default_factory=lambda: ScoreWithMeta(value=50),
        description="How well does this align with company strategy?"
    )

    # Execution attributes (15-20% weight)
    feasibility: ScoreWithMeta = Field(
        default_factory=lambda: ScoreWithMeta(value=50),
        description="How easy is it to build a solution? (higher = easier)"
    )
    time_to_value: ScoreWithMeta = Field(
        default_factory=lambda: ScoreWithMeta(value=50),
        description="How quickly can we deliver value? (higher = faster)"
    )
    risk_level: ScoreWithMeta = Field(
        default_factory=lambda: ScoreWithMeta(value=50),
        description="Implementation risk level (higher = less risky)"
    )

    def to_camel_case_dict(self) -> Dict[str, Any]:
        """Convert to camelCase for Nova frontend compatibility."""
        return {
            "applicability": self.applicability.model_dump(),
            "severity": self.severity.model_dump(),
            "frequency": self.frequency.model_dump(),
            "willingnessToPay": self.willingness_to_pay.model_dump(),
            "retentionImpact": self.retention_impact.model_dump(),
            "acquisitionPotential": self.acquisition_potential.model_dump(),
            "viralCoefficient": self.viral_coefficient.model_dump(),
            "strategicFit": self.strategic_fit.model_dump(),
            "feasibility": self.feasibility.model_dump(),
            "timeToValue": self.time_to_value.model_dump(),
            "riskLevel": self.risk_level.model_dump(),
        }


class EnhancedProblem(BaseModel):
    """A fully enriched problem matching Nova's EnhancedProblem type."""
    id: str = Field(default_factory=lambda: f"prob-{uuid.uuid4().hex[:8]}")
    tenant_id: str = "demo-tenant"
    sprint_id: Optional[str] = None

    # Content
    title: str
    description: str
    hypothesis: Optional[str] = None

    # Source & Evidence
    source: ProblemSource = ProblemSource.RESEARCH
    evidence_items: List[EvidenceItem] = Field(default_factory=list)
    evidence_summary: Optional[str] = None

    # Scores
    scores: ProblemScores = Field(default_factory=ProblemScores)
    priority_score: Optional[float] = None

    # Organization
    status: ProblemStatus = ProblemStatus.DISCOVERED
    is_shortlisted: bool = False
    shortlist_order: Optional[int] = None
    tags: List[str] = Field(default_factory=list)
    group_ids: List[str] = Field(default_factory=list)

    # Metadata
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    created_by: Optional[str] = "problem-enricher"
    last_scored_at: Optional[str] = None
    last_scored_by: Optional[str] = None

    def to_nova_format(self) -> Dict[str, Any]:
        """Convert to Nova's camelCase format for frontend/API."""
        return {
            "id": self.id,
            "tenantId": self.tenant_id,
            "sprintId": self.sprint_id,
            "title": self.title,
            "description": self.description,
            "hypothesis": self.hypothesis,
            "source": self.source.value,
            "evidenceItems": [
                {
                    "id": e.id,
                    "type": e.type.value,
                    "content": e.content,
                    "source": e.source,
                    "sourceUrl": e.source_url,
                    "reportedBy": e.reported_by,
                    "reportedAt": e.reported_at,
                    "sentiment": e.sentiment.value if e.sentiment else None,
                    "weight": e.weight,
                    "metadata": e.metadata,
                }
                for e in self.evidence_items
            ],
            "evidenceSummary": self.evidence_summary,
            "scores": self.scores.to_camel_case_dict(),
            "priorityScore": self.priority_score,
            "status": self.status.value,
            "isShortlisted": self.is_shortlisted,
            "shortlistOrder": self.shortlist_order,
            "tags": self.tags,
            "groupIds": self.group_ids,
            "createdAt": self.created_at,
            "updatedAt": self.updated_at,
            "createdBy": self.created_by,
            "lastScoredAt": self.last_scored_at,
            "lastScoredBy": self.last_scored_by,
        }


class RawProblem(BaseModel):
    """Raw problem data extracted from Excel before enrichment."""
    row_number: int
    title: Optional[str] = None
    description: Optional[str] = None
    context: Optional[str] = None  # Any additional context/notes from Excel
    existing_scores: Optional[Dict[str, Any]] = None  # Pre-existing scores to preserve
    existing_evidence: Optional[List[str]] = None  # Pre-existing evidence to preserve
    metadata: Dict[str, Any] = Field(default_factory=dict)  # Any other Excel columns


class EnrichmentBatch(BaseModel):
    """A batch of enriched problems ready for export."""
    batch_id: str = Field(default_factory=lambda: f"batch_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
    source_file: str
    processed_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    total_problems: int = 0
    problems: List[EnhancedProblem] = Field(default_factory=list)

    # Metadata
    enrichment_model: str = "claude-sonnet-4-20250514"
    total_tokens_used: int = 0
    processing_time_seconds: float = 0
