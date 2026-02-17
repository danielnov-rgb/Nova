#!/usr/bin/env python3
"""
Sync enriched problems to Nova API.

This script:
1. Creates a Sprint if it doesn't exist
2. Either enriches problems from Excel OR uses existing JSON
3. POSTs them to the Nova API

Usage:
    # Using existing enriched JSON file:
    python sync_to_nova.py --json data/output/enriched.json --sprint "Sprint 1"

    # Enrich from Excel and sync:
    python sync_to_nova.py --excel file.xlsx --sprint "Sprint 1"
"""

import argparse
import json
import os
import sys
import requests
from pathlib import Path
from typing import Optional, Dict, Any, List

from dotenv import load_dotenv
from rich.console import Console
from rich.table import Table

load_dotenv()

console = Console()

# Default Nova API URL
DEFAULT_API_URL = "http://localhost:3001/api"


class NovaApiClient:
    """Client for interacting with Nova API."""

    def __init__(self, base_url: str, email: str, password: str):
        self.base_url = base_url.rstrip('/')
        self.email = email
        self.password = password
        self.token: Optional[str] = None

    def login(self) -> bool:
        """Authenticate and get JWT token."""
        console.print("[dim]Logging into Nova API...[/dim]")

        try:
            response = requests.post(
                f"{self.base_url}/auth/login",
                json={"email": self.email, "password": self.password},
                headers={"Content-Type": "application/json"},
            )

            if response.status_code == 201 or response.status_code == 200:
                data = response.json()
                self.token = data.get("accessToken") or data.get("access_token") or data.get("token")
                if self.token:
                    console.print("[green]✓ Logged in successfully[/green]")
                    return True
                else:
                    console.print(f"[red]Login response missing token: {data}[/red]")
                    return False
            else:
                console.print(f"[red]Login failed: {response.status_code} - {response.text}[/red]")
                return False
        except requests.exceptions.ConnectionError:
            console.print(f"[red]Cannot connect to Nova API at {self.base_url}[/red]")
            console.print("[dim]Make sure the API is running (pnpm dev)[/dim]")
            return False

    def _headers(self) -> Dict[str, str]:
        """Get headers with auth token."""
        return {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.token}",
        }

    def get_sprints(self) -> List[Dict]:
        """Get all sprints."""
        response = requests.get(
            f"{self.base_url}/sprints",
            headers=self._headers(),
        )
        if response.status_code == 200:
            return response.json()
        return []

    def create_sprint(self, name: str, description: Optional[str] = None) -> Optional[Dict]:
        """Create a new sprint."""
        console.print(f"[dim]Creating sprint: {name}[/dim]")

        response = requests.post(
            f"{self.base_url}/sprints",
            json={"name": name, "description": description or f"Sprint: {name}"},
            headers=self._headers(),
        )

        if response.status_code in [200, 201]:
            sprint = response.json()
            console.print(f"[green]✓ Created sprint: {sprint['name']} (id: {sprint['id']})[/green]")
            return sprint
        else:
            console.print(f"[red]Failed to create sprint: {response.status_code} - {response.text}[/red]")
            return None

    def get_or_create_sprint(self, name: str) -> Optional[str]:
        """Get existing sprint by name or create new one. Returns sprint ID."""
        sprints = self.get_sprints()

        for sprint in sprints:
            if sprint.get('name', '').lower() == name.lower():
                console.print(f"[dim]Found existing sprint: {name} (id: {sprint['id']})[/dim]")
                return sprint['id']

        # Create new sprint
        sprint = self.create_sprint(name)
        return sprint['id'] if sprint else None

    def create_problem(self, problem: Dict, sprint_id: Optional[str] = None) -> Optional[Dict]:
        """Create a single problem via POST /problems."""
        payload = {
            "title": problem.get("title"),
            "description": problem.get("description"),
            "hypothesis": problem.get("hypothesis"),
            "source": problem.get("source", "IMPORT"),
            "evidenceItems": problem.get("evidenceItems", []),
            "scores": problem.get("scores", {}),
            "tags": problem.get("tags", []),
        }
        if sprint_id:
            payload["sprintId"] = sprint_id

        response = requests.post(
            f"{self.base_url}/problems",
            json=payload,
            headers=self._headers(),
        )

        if response.status_code in [200, 201]:
            return response.json()
        else:
            return None

    def import_enriched_problems(
        self,
        problems: List[Dict],
        sprint_id: Optional[str] = None,
    ) -> Dict:
        """Import enriched problems to Nova one at a time."""
        console.print(f"[dim]Importing {len(problems)} problems one by one...[/dim]")

        created = []
        failed = []

        for i, problem in enumerate(problems):
            result = self.create_problem(problem, sprint_id)
            if result:
                created.append(result)
                title = problem.get('title', 'Untitled')[:50]
                console.print(f"[green]✓ [{i+1}/{len(problems)}] {title}...[/green]")
            else:
                failed.append(problem)
                console.print(f"[yellow]✗ [{i+1}/{len(problems)}] Failed[/yellow]")

        return {"imported": len(created), "failed": len(failed), "problemIds": [p['id'] for p in created]}


def load_enriched_json(file_path: Path) -> List[Dict]:
    """Load enriched problems from JSON file."""
    with open(file_path) as f:
        data = json.load(f)

    # Handle batch format or direct array
    if isinstance(data, dict) and "problems" in data:
        return data["problems"]
    elif isinstance(data, list):
        return data
    else:
        console.print(f"[red]Unknown JSON format in {file_path}[/red]")
        return []


def enrich_from_excel(
    excel_path: Path,
    header_row: Optional[int] = None,
    desc_col: Optional[str] = None,
    limit: Optional[int] = None,
) -> List[Dict]:
    """Run the enricher on an Excel file and return problems."""
    # Import enricher modules
    from excel_parser import ExcelParser
    from claude_enricher import ClaudeEnricher

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        console.print("[red]ANTHROPIC_API_KEY required for enrichment[/red]")
        return []

    # Load Excel
    parser = ExcelParser(excel_path, header_row=header_row)
    parser.load()

    if desc_col:
        parser.set_column_mapping({'description': desc_col})

    # Count problems
    problem_count = sum(1 for _ in parser.iter_problems(limit=limit))
    parser.load()  # Reset iterator

    console.print(f"[dim]Enriching {problem_count} problems from Excel...[/dim]")

    # Enrich each problem
    enricher = ClaudeEnricher(api_key=api_key)
    enriched = []

    for raw_problem in parser.iter_problems(limit=limit):
        try:
            problem = enricher.enrich(raw_problem)
            enriched.append(problem.to_nova_format())
        except Exception as e:
            console.print(f"[yellow]Warning: Failed to enrich row {raw_problem.row_number}: {e}[/yellow]")

    console.print(f"[green]✓ Enriched {len(enriched)} problems[/green]")
    return enriched


def main():
    parser = argparse.ArgumentParser(description="Sync enriched problems to Nova API")

    # Input source (mutually exclusive)
    input_group = parser.add_mutually_exclusive_group(required=True)
    input_group.add_argument("--json", help="Path to enriched JSON file")
    input_group.add_argument("--excel", help="Path to Excel file to enrich and sync")

    # Excel options
    parser.add_argument("--header-row", type=int, help="Header row in Excel (0-indexed)")
    parser.add_argument("--desc-col", help="Description column name in Excel")
    parser.add_argument("--limit", type=int, help="Limit number of problems to process")

    # Sprint/Group
    parser.add_argument("--sprint", required=True, help="Sprint name to assign problems to")

    # API config
    parser.add_argument("--api-url", default=DEFAULT_API_URL, help=f"Nova API URL (default: {DEFAULT_API_URL})")
    parser.add_argument("--email", help="Admin email (or set NOVA_ADMIN_EMAIL)")
    parser.add_argument("--password", help="Admin password (or set NOVA_ADMIN_PASSWORD)")

    args = parser.parse_args()

    # Get credentials
    email = args.email or os.getenv("NOVA_ADMIN_EMAIL", "admin@nova.dev")
    password = args.password or os.getenv("NOVA_ADMIN_PASSWORD", "password123")

    # Initialize API client
    client = NovaApiClient(args.api_url, email, password)

    # Login
    if not client.login():
        sys.exit(1)

    # Get or create sprint
    sprint_id = client.get_or_create_sprint(args.sprint)
    if not sprint_id:
        console.print("[red]Failed to get/create sprint[/red]")
        sys.exit(1)

    # Load or enrich problems
    if args.json:
        json_path = Path(args.json)
        if not json_path.exists():
            console.print(f"[red]JSON file not found: {args.json}[/red]")
            sys.exit(1)
        problems = load_enriched_json(json_path)
    else:
        excel_path = Path(args.excel)
        if not excel_path.exists():
            console.print(f"[red]Excel file not found: {args.excel}[/red]")
            sys.exit(1)
        problems = enrich_from_excel(
            excel_path,
            header_row=args.header_row,
            desc_col=args.desc_col,
            limit=args.limit,
        )

    if not problems:
        console.print("[yellow]No problems to import[/yellow]")
        return

    # Import to Nova
    result = client.import_enriched_problems(problems, sprint_id)

    # Print summary
    if "error" not in result:
        table = Table(title="Import Summary")
        table.add_column("Metric", style="cyan")
        table.add_column("Value", style="green")
        table.add_row("Problems imported", str(result.get('imported', len(problems))))
        table.add_row("Sprint", args.sprint)
        table.add_row("Sprint ID", sprint_id)
        if 'problemIds' in result:
            table.add_row("Problem IDs", f"{len(result['problemIds'])} created")
        console.print(table)
        console.print("\n[bold green]✓ Sync complete![/bold green]")


if __name__ == "__main__":
    main()
