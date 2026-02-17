"""
Claude API integration for problem enrichment.
"""

import json
import re
from typing import Optional
from datetime import datetime

from anthropic import Anthropic
from rich.console import Console
from pydantic import ValidationError

from schema import (
    RawProblem,
    EnhancedProblem,
    ProblemScores,
    ScoreWithMeta,
    EvidenceItem,
    EvidenceType,
    Sentiment,
    ScoreSource,
    ProblemSource,
    ProblemStatus,
)
from prompts import SYSTEM_PROMPT, get_enrichment_prompt, DEFAULT_BUSINESS_CONTEXT

console = Console()


class ClaudeEnricher:
    """Enriches raw problems using Claude API."""

    def __init__(
        self,
        api_key: str,
        model: str = "claude-sonnet-4-20250514",
        business_context: Optional[str] = None,
        dry_run: bool = False,
    ):
        self.client = Anthropic(api_key=api_key)
        self.model = model
        self.business_context = business_context or DEFAULT_BUSINESS_CONTEXT
        self.dry_run = dry_run
        self.total_tokens_used = 0

    def _extract_json(self, text: str) -> dict:
        """Extract JSON from Claude's response, handling markdown code blocks."""
        # Try to find JSON in code blocks first
        code_block_match = re.search(r'```(?:json)?\s*([\s\S]*?)```', text)
        if code_block_match:
            json_str = code_block_match.group(1).strip()
        else:
            # Assume the whole response is JSON
            json_str = text.strip()

        # Remove any leading/trailing whitespace or newlines
        json_str = json_str.strip()

        try:
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            console.print(f"[red]JSON parse error: {e}[/red]")
            console.print(f"[dim]Raw response: {text[:500]}...[/dim]")
            raise

    def _parse_evidence_type(self, type_str: str) -> EvidenceType:
        """Parse evidence type string to enum."""
        type_map = {
            "MARKET_RESEARCH": EvidenceType.MARKET_RESEARCH,
            "EXPERT_OPINION": EvidenceType.EXPERT_OPINION,
            "ANALYTICS_DATA": EvidenceType.ANALYTICS_DATA,
            "INTERVIEW_QUOTE": EvidenceType.INTERVIEW_QUOTE,
            "SURVEY_RESPONSE": EvidenceType.SURVEY_RESPONSE,
            "SUPPORT_TICKET": EvidenceType.SUPPORT_TICKET,
            "COMPETITOR_INTEL": EvidenceType.COMPETITOR_INTEL,
            "SYNTHETIC_INTERVIEW": EvidenceType.SYNTHETIC_INTERVIEW,
            "OBSERVATION": EvidenceType.OBSERVATION,
            "OTHER": EvidenceType.OTHER,
        }
        return type_map.get(type_str.upper(), EvidenceType.OTHER)

    def _parse_sentiment(self, sentiment_str: Optional[str]) -> Optional[Sentiment]:
        """Parse sentiment string to enum."""
        if not sentiment_str:
            return None
        sentiment_map = {
            "POSITIVE": Sentiment.POSITIVE,
            "NEGATIVE": Sentiment.NEGATIVE,
            "NEUTRAL": Sentiment.NEUTRAL,
        }
        return sentiment_map.get(sentiment_str.upper())

    def _parse_score(self, score_data: dict) -> ScoreWithMeta:
        """Parse a score object from Claude's response."""
        return ScoreWithMeta(
            value=min(100, max(0, int(score_data.get("value", 50)))),
            justification=score_data.get("justification"),
            source=ScoreSource.AI,
            confidence=0.8,  # Default AI confidence
            last_updated_at=datetime.now().isoformat(),
            last_updated_by="problem-enricher",
        )

    def _parse_scores(self, scores_data: dict) -> ProblemScores:
        """Parse all scores from Claude's response."""
        return ProblemScores(
            applicability=self._parse_score(scores_data.get("applicability", {})),
            severity=self._parse_score(scores_data.get("severity", {})),
            frequency=self._parse_score(scores_data.get("frequency", {})),
            willingness_to_pay=self._parse_score(scores_data.get("willingness_to_pay", {})),
            retention_impact=self._parse_score(scores_data.get("retention_impact", {})),
            acquisition_potential=self._parse_score(scores_data.get("acquisition_potential", {})),
            viral_coefficient=self._parse_score(scores_data.get("viral_coefficient", {})),
            strategic_fit=self._parse_score(scores_data.get("strategic_fit", {})),
            feasibility=self._parse_score(scores_data.get("feasibility", {})),
            time_to_value=self._parse_score(scores_data.get("time_to_value", {})),
            risk_level=self._parse_score(scores_data.get("risk_level", {})),
        )

    def _calculate_priority_score(self, scores: ProblemScores) -> float:
        """
        Calculate overall priority score using weighted formula.

        Weights:
        - Core attributes: 40-50%
        - Strategic attributes: 30-40%
        - Execution attributes: 15-20%
        """
        # Core (45% total)
        core = (
            scores.applicability.value * 0.12 +
            scores.severity.value * 0.12 +
            scores.frequency.value * 0.11 +
            scores.willingness_to_pay.value * 0.10
        )

        # Strategic (35% total)
        strategic = (
            scores.retention_impact.value * 0.09 +
            scores.acquisition_potential.value * 0.09 +
            scores.viral_coefficient.value * 0.08 +
            scores.strategic_fit.value * 0.09
        )

        # Execution (20% total)
        execution = (
            scores.feasibility.value * 0.07 +
            scores.time_to_value.value * 0.06 +
            scores.risk_level.value * 0.07
        )

        return round(core + strategic + execution, 2)

    def enrich(self, raw_problem: RawProblem) -> EnhancedProblem:
        """
        Enrich a raw problem using Claude.

        Args:
            raw_problem: The raw problem extracted from Excel

        Returns:
            EnhancedProblem with full enrichment
        """
        # Generate the prompt
        prompt = get_enrichment_prompt(
            title=raw_problem.title,
            description=raw_problem.description,
            context=raw_problem.context,
            existing_evidence=raw_problem.existing_evidence,
            business_context=self.business_context,
        )

        if self.dry_run:
            # Return a placeholder for dry run
            console.print(f"[yellow]DRY RUN: Would enrich problem from row {raw_problem.row_number}[/yellow]")
            return EnhancedProblem(
                title=raw_problem.title or "Untitled Problem",
                description=raw_problem.description or "No description provided",
                source=ProblemSource.IMPORT,
            )

        # Call Claude API
        console.print(f"[dim]Calling Claude API for row {raw_problem.row_number}...[/dim]")

        response = self.client.messages.create(
            model=self.model,
            max_tokens=2000,
            system=SYSTEM_PROMPT,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        # Track token usage
        self.total_tokens_used += response.usage.input_tokens + response.usage.output_tokens

        # Extract and parse JSON response
        response_text = response.content[0].text
        data = self._extract_json(response_text)

        # Parse evidence items
        evidence_items = []
        for ev in data.get("evidence_items", []):
            evidence_items.append(EvidenceItem(
                type=self._parse_evidence_type(ev.get("type", "OTHER")),
                content=ev.get("content", ""),
                source=ev.get("source", "AI Generated"),
                sentiment=self._parse_sentiment(ev.get("sentiment")),
                weight=ev.get("weight"),
            ))

        # Parse scores
        scores = self._parse_scores(data.get("scores", {}))

        # Calculate priority score
        priority_score = self._calculate_priority_score(scores)

        # Build the enriched problem
        enriched = EnhancedProblem(
            title=data.get("title", raw_problem.title or "Untitled Problem"),
            description=data.get("description", raw_problem.description or ""),
            hypothesis=data.get("hypothesis"),
            source=ProblemSource.IMPORT,
            evidence_items=evidence_items,
            evidence_summary=data.get("evidence_summary"),
            scores=scores,
            priority_score=priority_score,
            status=ProblemStatus.DISCOVERED,
            tags=data.get("tags", []),
            created_by="problem-enricher",
            last_scored_at=datetime.now().isoformat(),
            last_scored_by="claude-enricher",
        )

        console.print(f"[green]✓ Enriched: {enriched.title} (Priority: {priority_score})[/green]")

        return enriched

    def get_token_usage(self) -> int:
        """Return total tokens used across all enrichments."""
        return self.total_tokens_used


def enrich_problem(
    raw_problem: RawProblem,
    api_key: str,
    model: str = "claude-sonnet-4-20250514",
    business_context: Optional[str] = None,
    dry_run: bool = False,
) -> EnhancedProblem:
    """
    Convenience function to enrich a single problem.

    Args:
        raw_problem: The raw problem to enrich
        api_key: Anthropic API key
        model: Claude model to use
        business_context: Optional business context
        dry_run: If True, skip API calls

    Returns:
        EnhancedProblem
    """
    enricher = ClaudeEnricher(
        api_key=api_key,
        model=model,
        business_context=business_context,
        dry_run=dry_run,
    )
    return enricher.enrich(raw_problem)
