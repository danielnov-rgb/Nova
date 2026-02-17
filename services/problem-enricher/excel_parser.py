"""
Excel parser for extracting raw problems from spreadsheets.
Yields one problem at a time to keep memory usage low.
"""

import re
from pathlib import Path
from typing import Iterator, Optional, Dict, Any, List, Union
import pandas as pd
from rich.console import Console

from schema import RawProblem

console = Console()


class ExcelParser:
    """Extracts problems from Excel files row by row."""

    # Common column name patterns
    TITLE_PATTERNS = ['title', 'problem', 'name', 'issue', 'topic']
    DESCRIPTION_PATTERNS = ['description', 'desc', 'details', 'summary', 'notes']
    CONTEXT_PATTERNS = ['context', 'background', 'additional', 'info']
    SCORE_PATTERNS = ['score', 'rating', 'priority', 'severity', 'impact']

    def __init__(
        self,
        file_path: Union[str, Path],
        sheet_name: Optional[str] = None,
        header_row: Optional[int] = None,
    ):
        self.file_path = Path(file_path)
        self.sheet_name = sheet_name
        self.header_row = header_row
        self.df: Optional[pd.DataFrame] = None
        self.column_mapping: Dict[str, str] = {}

    def load(self) -> 'ExcelParser':
        """Load the Excel file and detect column mappings."""
        if not self.file_path.exists():
            raise FileNotFoundError(f"Excel file not found: {self.file_path}")

        # Load Excel file
        read_kwargs = {}
        if self.header_row is not None:
            read_kwargs['header'] = self.header_row

        if self.sheet_name:
            self.df = pd.read_excel(self.file_path, sheet_name=self.sheet_name, **read_kwargs)
        else:
            # Try to find the most relevant sheet
            xl = pd.ExcelFile(self.file_path)
            sheet_names = xl.sheet_names

            # Look for sheets with "problem" in the name, otherwise use first
            problem_sheets = [s for s in sheet_names if 'problem' in s.lower()]
            selected_sheet = problem_sheets[0] if problem_sheets else sheet_names[0]

            console.print(f"[dim]Using sheet: {selected_sheet}[/dim]")
            self.df = pd.read_excel(self.file_path, sheet_name=selected_sheet, **read_kwargs)

        # Clean column names
        self.df.columns = [str(col).strip() for col in self.df.columns]

        # Auto-detect column mappings
        self._detect_columns()

        console.print(f"[green]Loaded {len(self.df)} rows from {self.file_path.name}[/green]")
        console.print(f"[dim]Column mapping: {self.column_mapping}[/dim]")

        return self

    def _detect_columns(self) -> None:
        """Auto-detect which columns contain title, description, etc."""
        columns_lower = {col.lower(): col for col in self.df.columns}

        # Find title column
        for pattern in self.TITLE_PATTERNS:
            for col_lower, col_orig in columns_lower.items():
                if pattern in col_lower:
                    self.column_mapping['title'] = col_orig
                    break
            if 'title' in self.column_mapping:
                break

        # Find description column
        for pattern in self.DESCRIPTION_PATTERNS:
            for col_lower, col_orig in columns_lower.items():
                if pattern in col_lower and col_orig != self.column_mapping.get('title'):
                    self.column_mapping['description'] = col_orig
                    break
            if 'description' in self.column_mapping:
                break

        # Find context columns (can be multiple)
        context_cols = []
        for pattern in self.CONTEXT_PATTERNS:
            for col_lower, col_orig in columns_lower.items():
                if pattern in col_lower:
                    context_cols.append(col_orig)
        if context_cols:
            self.column_mapping['context'] = context_cols

        # Find score columns
        score_cols = []
        for col_lower, col_orig in columns_lower.items():
            for pattern in self.SCORE_PATTERNS:
                if pattern in col_lower:
                    score_cols.append(col_orig)
                    break
        if score_cols:
            self.column_mapping['scores'] = score_cols

    def set_column_mapping(self, mapping: Dict[str, str]) -> 'ExcelParser':
        """Manually set column mappings if auto-detection fails."""
        self.column_mapping.update(mapping)
        return self

    def _get_cell_value(self, row: pd.Series, column: str) -> Optional[str]:
        """Safely get a cell value, handling NaN and empty strings."""
        if column not in row.index:
            return None
        value = row[column]
        if pd.isna(value):
            return None
        value = str(value).strip()
        return value if value else None

    def _extract_evidence(self, row: pd.Series) -> List[str]:
        """Extract any evidence-like content from the row."""
        evidence = []

        # Look for columns that might contain evidence
        evidence_patterns = ['evidence', 'quote', 'feedback', 'comment', 'insight', 'opinion']

        for col in row.index:
            col_lower = col.lower()
            for pattern in evidence_patterns:
                if pattern in col_lower:
                    value = self._get_cell_value(row, col)
                    if value and len(value) > 10:  # Skip short values
                        evidence.append(f"{col}: {value}")
                    break

        return evidence

    def _extract_scores(self, row: pd.Series) -> Dict[str, Any]:
        """Extract any existing scores from the row."""
        scores = {}

        score_cols = self.column_mapping.get('scores', [])
        for col in score_cols:
            value = self._get_cell_value(row, col)
            if value:
                # Try to parse as number
                try:
                    scores[col] = float(value)
                except ValueError:
                    scores[col] = value

        return scores

    def iter_problems(self, start_row: int = 0, limit: Optional[int] = None) -> Iterator[RawProblem]:
        """
        Iterate through problems one at a time.

        Args:
            start_row: Row index to start from (for resume capability)
            limit: Maximum number of problems to yield

        Yields:
            RawProblem objects ready for enrichment
        """
        if self.df is None:
            raise RuntimeError("Must call load() before iterating")

        count = 0
        for idx, row in self.df.iterrows():
            # Skip rows before start_row
            if idx < start_row:
                continue

            # Check limit
            if limit is not None and count >= limit:
                break

            # Extract title
            title = None
            if 'title' in self.column_mapping:
                title = self._get_cell_value(row, self.column_mapping['title'])

            # Extract description
            description = None
            if 'description' in self.column_mapping:
                description = self._get_cell_value(row, self.column_mapping['description'])

            # Skip rows with no content
            if not title and not description:
                continue

            # Extract context
            context_parts = []
            context_cols = self.column_mapping.get('context', [])
            if isinstance(context_cols, list):
                for col in context_cols:
                    value = self._get_cell_value(row, col)
                    if value:
                        context_parts.append(f"{col}: {value}")
            context = "\n".join(context_parts) if context_parts else None

            # Extract existing scores and evidence
            existing_scores = self._extract_scores(row)
            existing_evidence = self._extract_evidence(row)

            # Collect all other columns as metadata
            metadata = {}
            mapped_cols = set()
            if 'title' in self.column_mapping:
                mapped_cols.add(self.column_mapping['title'])
            if 'description' in self.column_mapping:
                mapped_cols.add(self.column_mapping['description'])
            for col in self.column_mapping.get('context', []):
                mapped_cols.add(col)
            for col in self.column_mapping.get('scores', []):
                mapped_cols.add(col)

            for col in row.index:
                if col not in mapped_cols:
                    value = self._get_cell_value(row, col)
                    if value:
                        metadata[col] = value

            yield RawProblem(
                row_number=idx,
                title=title,
                description=description,
                context=context,
                existing_scores=existing_scores if existing_scores else None,
                existing_evidence=existing_evidence if existing_evidence else None,
                metadata=metadata
            )

            count += 1

    def preview(self, n: int = 3) -> None:
        """Print a preview of the first n problems."""
        console.print(f"\n[bold]Preview of first {n} problems:[/bold]\n")

        for i, problem in enumerate(self.iter_problems(limit=n)):
            console.print(f"[cyan]Row {problem.row_number}:[/cyan]")
            console.print(f"  Title: {problem.title or '[not found]'}")
            console.print(f"  Description: {(problem.description or '[not found]')[:100]}...")
            if problem.context:
                console.print(f"  Context: {problem.context[:100]}...")
            if problem.existing_scores:
                console.print(f"  Existing scores: {problem.existing_scores}")
            if problem.existing_evidence:
                console.print(f"  Existing evidence: {len(problem.existing_evidence)} items")
            console.print()


def parse_excel(
    file_path: Union[str, Path],
    sheet_name: Optional[str] = None,
    column_mapping: Optional[Dict[str, str]] = None,
    start_row: int = 0,
    limit: Optional[int] = None
) -> Iterator[RawProblem]:
    """
    Convenience function to parse an Excel file.

    Args:
        file_path: Path to the Excel file
        sheet_name: Optional sheet name (auto-detects if not provided)
        column_mapping: Optional manual column mapping
        start_row: Row to start from
        limit: Maximum problems to yield

    Yields:
        RawProblem objects
    """
    parser = ExcelParser(file_path, sheet_name)
    parser.load()

    if column_mapping:
        parser.set_column_mapping(column_mapping)

    yield from parser.iter_problems(start_row=start_row, limit=limit)


if __name__ == "__main__":
    # Quick test with the existing Excel file
    import sys

    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "../../Context/MS - PD - S1 - Problem Scoring v28112025.xlsx"

    parser = ExcelParser(file_path)
    parser.load()
    parser.preview(3)
