"""
Output writers for enriched problems.
Supports JSON, CSV, and TypeScript formats.
"""

import json
import csv
from datetime import datetime
from pathlib import Path
from typing import List, Optional, Union

from rich.console import Console

from schema import EnhancedProblem, EnrichmentBatch

console = Console()


class OutputWriter:
    """Writes enriched problems to various formats."""

    def __init__(self, output_dir: Union[str, Path] = "data/output"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def _generate_filename(self, prefix: str, extension: str) -> Path:
        """Generate a timestamped filename."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        return self.output_dir / f"{prefix}_{timestamp}.{extension}"

    def write_json(
        self,
        batch: EnrichmentBatch,
        filename: Optional[str] = None,
        pretty: bool = True,
    ) -> Path:
        """
        Write enriched problems to JSON file.

        Args:
            batch: The enrichment batch to write
            filename: Optional custom filename
            pretty: Whether to pretty-print the JSON

        Returns:
            Path to the written file
        """
        if filename:
            filepath = self.output_dir / filename
        else:
            filepath = self._generate_filename("enriched_problems", "json")

        # Convert to Nova-compatible format
        output = {
            "batch_id": batch.batch_id,
            "source_file": batch.source_file,
            "processed_at": batch.processed_at,
            "total_problems": batch.total_problems,
            "enrichment_model": batch.enrichment_model,
            "total_tokens_used": batch.total_tokens_used,
            "processing_time_seconds": batch.processing_time_seconds,
            "problems": [p.to_nova_format() for p in batch.problems],
        }

        with open(filepath, "w", encoding="utf-8") as f:
            if pretty:
                json.dump(output, f, indent=2, ensure_ascii=False)
            else:
                json.dump(output, f, ensure_ascii=False)

        console.print(f"[green]✓ Written JSON: {filepath}[/green]")
        return filepath

    def write_csv(
        self,
        batch: EnrichmentBatch,
        filename: Optional[str] = None,
    ) -> Path:
        """
        Write enriched problems to CSV file.
        Flattens the structure for spreadsheet compatibility.

        Args:
            batch: The enrichment batch to write
            filename: Optional custom filename

        Returns:
            Path to the written file
        """
        if filename:
            filepath = self.output_dir / filename
        else:
            filepath = self._generate_filename("enriched_problems", "csv")

        # Define CSV columns
        columns = [
            "id",
            "title",
            "description",
            "hypothesis",
            "evidence_summary",
            "priority_score",
            "status",
            "tags",
            # Scores
            "applicability",
            "severity",
            "frequency",
            "willingness_to_pay",
            "retention_impact",
            "acquisition_potential",
            "viral_coefficient",
            "strategic_fit",
            "feasibility",
            "time_to_value",
            "risk_level",
            # Metadata
            "created_at",
            "evidence_count",
        ]

        with open(filepath, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=columns)
            writer.writeheader()

            for problem in batch.problems:
                row = {
                    "id": problem.id,
                    "title": problem.title,
                    "description": problem.description,
                    "hypothesis": problem.hypothesis,
                    "evidence_summary": problem.evidence_summary,
                    "priority_score": problem.priority_score,
                    "status": problem.status.value,
                    "tags": ", ".join(problem.tags),
                    # Scores
                    "applicability": problem.scores.applicability.value,
                    "severity": problem.scores.severity.value,
                    "frequency": problem.scores.frequency.value,
                    "willingness_to_pay": problem.scores.willingness_to_pay.value,
                    "retention_impact": problem.scores.retention_impact.value,
                    "acquisition_potential": problem.scores.acquisition_potential.value,
                    "viral_coefficient": problem.scores.viral_coefficient.value,
                    "strategic_fit": problem.scores.strategic_fit.value,
                    "feasibility": problem.scores.feasibility.value,
                    "time_to_value": problem.scores.time_to_value.value,
                    "risk_level": problem.scores.risk_level.value,
                    # Metadata
                    "created_at": problem.created_at,
                    "evidence_count": len(problem.evidence_items),
                }
                writer.writerow(row)

        console.print(f"[green]✓ Written CSV: {filepath}[/green]")
        return filepath

    def write_typescript(
        self,
        batch: EnrichmentBatch,
        filename: Optional[str] = None,
        variable_name: str = "enrichedProblems",
    ) -> Path:
        """
        Write enriched problems as a TypeScript file.
        Can be directly imported into Nova frontend.

        Args:
            batch: The enrichment batch to write
            filename: Optional custom filename
            variable_name: Name for the exported constant

        Returns:
            Path to the written file
        """
        if filename:
            filepath = self.output_dir / filename
        else:
            filepath = self._generate_filename("enriched_problems", "ts")

        # Convert problems to Nova format
        problems_data = [p.to_nova_format() for p in batch.problems]

        # Generate TypeScript
        ts_content = f'''/**
 * Auto-generated by problem-enricher
 * Source: {batch.source_file}
 * Generated: {batch.processed_at}
 * Model: {batch.enrichment_model}
 */

import type {{ EnhancedProblem }} from '../_lib/types/problem';

export const {variable_name}: EnhancedProblem[] = {json.dumps(problems_data, indent=2)};

export const batchMetadata = {{
  batchId: "{batch.batch_id}",
  sourceFile: "{batch.source_file}",
  processedAt: "{batch.processed_at}",
  totalProblems: {batch.total_problems},
  enrichmentModel: "{batch.enrichment_model}",
  totalTokensUsed: {batch.total_tokens_used},
  processingTimeSeconds: {batch.processing_time_seconds},
}};
'''

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(ts_content)

        console.print(f"[green]✓ Written TypeScript: {filepath}[/green]")
        return filepath

    def append_problem(
        self,
        problem: EnhancedProblem,
        filename: str = "enriched_problems_current.jsonl",
    ) -> Path:
        """
        Append a single problem to a JSONL file.
        Useful for streaming output during processing.

        Args:
            problem: The problem to append
            filename: The JSONL file to append to

        Returns:
            Path to the file
        """
        filepath = self.output_dir / filename

        with open(filepath, "a", encoding="utf-8") as f:
            json.dump(problem.to_nova_format(), f, ensure_ascii=False)
            f.write("\n")

        return filepath


def write_batch(
    problems: List[EnhancedProblem],
    source_file: str,
    output_dir: Union[str, Path] = "data/output",
    format: str = "json",
    model: str = "claude-sonnet-4-20250514",
    tokens_used: int = 0,
    processing_time: float = 0,
) -> Path:
    """
    Convenience function to write a batch of problems.

    Args:
        problems: List of enriched problems
        source_file: Original source file name
        output_dir: Output directory
        format: Output format (json, csv, typescript)
        model: Model used for enrichment
        tokens_used: Total tokens used
        processing_time: Processing time in seconds

    Returns:
        Path to the written file
    """
    batch = EnrichmentBatch(
        source_file=source_file,
        total_problems=len(problems),
        problems=problems,
        enrichment_model=model,
        total_tokens_used=tokens_used,
        processing_time_seconds=processing_time,
    )

    writer = OutputWriter(output_dir)

    if format == "json":
        return writer.write_json(batch)
    elif format == "csv":
        return writer.write_csv(batch)
    elif format == "typescript":
        return writer.write_typescript(batch)
    else:
        raise ValueError(f"Unknown format: {format}")
