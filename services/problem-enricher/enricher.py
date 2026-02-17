#!/usr/bin/env python3
"""
Problem Enricher CLI

Reads problems from Excel, enriches them using Claude API,
and outputs structured JSON/CSV ready for Nova import.

Usage:
    python enricher.py --input problems.xlsx
    python enricher.py --input problems.xlsx --dry-run
    python enricher.py --input problems.xlsx --limit 5 --format typescript
"""

import argparse
import os
import sys
import time
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TaskProgressColumn
from rich.panel import Panel
from rich.table import Table

from excel_parser import ExcelParser
from claude_enricher import ClaudeEnricher
from output_writer import OutputWriter
from schema import EnrichmentBatch

# Load environment variables
load_dotenv()

console = Console()


def main():
    parser = argparse.ArgumentParser(
        description="Enrich problems from Excel using Claude API",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python enricher.py --input data/input/problems.xlsx
  python enricher.py --input problems.xlsx --dry-run
  python enricher.py --input problems.xlsx --limit 5 --format csv
  python enricher.py --input problems.xlsx --start-row 10 --verbose
        """,
    )

    parser.add_argument(
        "--input", "-i",
        required=True,
        help="Path to the Excel file containing problems",
    )
    parser.add_argument(
        "--sheet",
        help="Sheet name to read (auto-detects if not specified)",
    )
    parser.add_argument(
        "--output-dir", "-o",
        default="data/output",
        help="Output directory (default: data/output)",
    )
    parser.add_argument(
        "--format", "-f",
        choices=["json", "csv", "typescript"],
        default="json",
        help="Output format (default: json)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview extraction without API calls",
    )
    parser.add_argument(
        "--start-row",
        type=int,
        default=0,
        help="Row number to start from (for resume)",
    )
    parser.add_argument(
        "--limit",
        type=int,
        help="Maximum number of problems to process",
    )
    parser.add_argument(
        "--header-row",
        type=int,
        help="Row number containing column headers (0-indexed)",
    )
    parser.add_argument(
        "--title-col",
        help="Column name containing problem titles",
    )
    parser.add_argument(
        "--desc-col",
        help="Column name containing problem descriptions",
    )
    parser.add_argument(
        "--context",
        help="Path to a text file with business context",
    )
    parser.add_argument(
        "--model",
        default="claude-sonnet-4-20250514",
        help="Claude model to use (default: claude-sonnet-4-20250514)",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Enable verbose output",
    )
    parser.add_argument(
        "--preview",
        action="store_true",
        help="Preview first 3 problems and exit",
    )

    args = parser.parse_args()

    # Validate input file
    input_path = Path(args.input)
    if not input_path.exists():
        # Try looking in data/input
        alt_path = Path("data/input") / args.input
        if alt_path.exists():
            input_path = alt_path
        else:
            console.print(f"[red]Error: Input file not found: {args.input}[/red]")
            sys.exit(1)

    # Get API key (not needed for preview or dry run)
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key and not args.dry_run and not args.preview:
        console.print("[red]Error: ANTHROPIC_API_KEY not found in environment[/red]")
        console.print("[dim]Set it in .env or export ANTHROPIC_API_KEY=...[/dim]")
        sys.exit(1)

    # Load business context if provided
    business_context = None
    if args.context:
        context_path = Path(args.context)
        if context_path.exists():
            business_context = context_path.read_text()
            console.print(f"[dim]Loaded business context from {context_path}[/dim]")
        else:
            console.print(f"[yellow]Warning: Context file not found: {args.context}[/yellow]")

    # Print header
    console.print(Panel.fit(
        "[bold blue]Nova Problem Enricher[/bold blue]\n"
        f"Input: {input_path}\n"
        f"Model: {args.model}\n"
        f"Format: {args.format}",
        title="🔬 Starting Enrichment",
    ))

    # Load Excel file
    console.print("\n[bold]Step 1: Loading Excel file...[/bold]")
    excel_parser = ExcelParser(
        input_path,
        sheet_name=args.sheet,
        header_row=args.header_row,
    )
    excel_parser.load()

    # Apply manual column mappings if specified
    if args.title_col:
        excel_parser.set_column_mapping({'title': args.title_col})
    if args.desc_col:
        excel_parser.set_column_mapping({'description': args.desc_col})

    # Preview mode
    if args.preview:
        excel_parser.preview(3)
        return

    # Count total problems
    total_problems = sum(1 for _ in excel_parser.iter_problems(start_row=args.start_row, limit=args.limit))
    excel_parser.load()  # Reload to reset iterator

    console.print(f"[dim]Found {total_problems} problems to process[/dim]")

    if total_problems == 0:
        console.print("[yellow]No problems found in the Excel file[/yellow]")
        return

    # Initialize enricher
    enricher = ClaudeEnricher(
        api_key=api_key or "",
        model=args.model,
        business_context=business_context,
        dry_run=args.dry_run,
    )

    # Process problems
    console.print(f"\n[bold]Step 2: Enriching problems{' (DRY RUN)' if args.dry_run else ''}...[/bold]")

    enriched_problems = []
    start_time = time.time()

    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        TaskProgressColumn(),
        console=console,
    ) as progress:
        task = progress.add_task("[cyan]Enriching...", total=total_problems)

        for raw_problem in excel_parser.iter_problems(start_row=args.start_row, limit=args.limit):
            try:
                enriched = enricher.enrich(raw_problem)
                enriched_problems.append(enriched)

                if args.verbose:
                    console.print(f"  [dim]→ {enriched.title} (Priority: {enriched.priority_score})[/dim]")

            except Exception as e:
                console.print(f"[red]Error enriching row {raw_problem.row_number}: {e}[/red]")
                if args.verbose:
                    import traceback
                    traceback.print_exc()

            progress.advance(task)

    processing_time = time.time() - start_time

    # Create batch
    batch = EnrichmentBatch(
        source_file=input_path.name,
        total_problems=len(enriched_problems),
        problems=enriched_problems,
        enrichment_model=args.model,
        total_tokens_used=enricher.get_token_usage(),
        processing_time_seconds=round(processing_time, 2),
    )

    # Write output
    console.print(f"\n[bold]Step 3: Writing output...[/bold]")

    output_writer = OutputWriter(args.output_dir)

    if args.format == "json":
        output_path = output_writer.write_json(batch)
    elif args.format == "csv":
        output_path = output_writer.write_csv(batch)
    elif args.format == "typescript":
        output_path = output_writer.write_typescript(batch)

    # Print summary
    summary_table = Table(title="Enrichment Summary", show_header=False)
    summary_table.add_column("Metric", style="cyan")
    summary_table.add_column("Value", style="green")

    summary_table.add_row("Problems processed", str(len(enriched_problems)))
    summary_table.add_row("Processing time", f"{processing_time:.1f}s")
    summary_table.add_row("Tokens used", f"{enricher.get_token_usage():,}")
    summary_table.add_row("Output file", str(output_path))

    if enriched_problems:
        avg_priority = sum(p.priority_score or 0 for p in enriched_problems) / len(enriched_problems)
        summary_table.add_row("Avg priority score", f"{avg_priority:.1f}")

        # Top 3 problems
        top_problems = sorted(enriched_problems, key=lambda p: p.priority_score or 0, reverse=True)[:3]
        for i, p in enumerate(top_problems, 1):
            summary_table.add_row(f"Top {i}", f"{p.title} ({p.priority_score})")

    console.print("\n")
    console.print(summary_table)
    console.print("\n[bold green]✓ Enrichment complete![/bold green]")


if __name__ == "__main__":
    main()
