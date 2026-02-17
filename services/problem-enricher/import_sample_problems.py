#!/usr/bin/env python3
"""
Import the existing 17 enriched sample problems to Nova API.

This script reads the TypeScript sample-problems.ts file, converts it to JSON,
and imports to the Nova API under a specified sprint.

Usage:
    python import_sample_problems.py --sprint "Sprint 1"
"""

import argparse
import json
import os
import re
import sys
import requests
from pathlib import Path
from typing import Optional, Dict, Any, List

from dotenv import load_dotenv
from rich.console import Console

load_dotenv()

console = Console()

# Path to sample problems TypeScript file
SAMPLE_PROBLEMS_PATH = Path(__file__).parent.parent.parent / "apps/web/app/admin/problems/_data/sample-problems.ts"
DEFAULT_API_URL = "http://localhost:3001/api"


def extract_problems_from_ts(ts_path: Path) -> List[Dict]:
    """
    Extract problems array from TypeScript file.
    This is a simple parser that extracts the sampleProblems array.
    """
    content = ts_path.read_text()

    # Find sampleProblems array
    match = re.search(r'export const sampleProblems[^=]*=\s*\[([\s\S]*?)\];\s*(?=export|$)', content)
    if not match:
        console.print("[red]Could not find sampleProblems in TypeScript file[/red]")
        return []

    array_content = match.group(1)

    # Extract individual problem objects
    problems = []
    # Use regex to find each object in the array
    obj_pattern = re.compile(r'\{[\s\S]*?\n  \}', re.MULTILINE)

    for obj_match in obj_pattern.finditer(array_content):
        obj_str = obj_match.group(0)
        try:
            # Convert TypeScript object literal to JSON
            # Handle property names without quotes
            json_str = re.sub(r'(\s)(\w+):', r'\1"\2":', obj_str)
            # Handle trailing commas
            json_str = re.sub(r',(\s*[}\]])', r'\1', json_str)
            # Handle single quotes to double quotes
            json_str = json_str.replace("'", '"')

            problem = json.loads(json_str)
            problems.append(problem)
        except json.JSONDecodeError as e:
            # Skip malformed objects
            continue

    return problems


def parse_sample_problems_manually(ts_path: Path) -> List[Dict]:
    """
    Parse sample problems by executing a Node.js script.
    More reliable than regex parsing.
    """
    import subprocess

    # Create a temp Node script to extract the data
    node_script = f"""
    const fs = require('fs');
    const path = require('path');

    // Read the TS file
    const content = fs.readFileSync('{ts_path}', 'utf-8');

    // Extract the array content between sampleProblems = [ and the closing ];
    const match = content.match(/export const sampleProblems[^=]*=\\s*\\[([\\s\\S]*?)\\];\\s*\\/\\/ End/);
    if (!match) {{
        // Try simpler match
        const simpleMatch = content.match(/sampleProblems[^=]*=\\s*(\\[[\\s\\S]*?\\]);/);
        if (simpleMatch) {{
            try {{
                // Use eval to parse (safe since we control the input)
                const problems = eval(simpleMatch[1]);
                console.log(JSON.stringify(problems, null, 2));
            }} catch (e) {{
                console.error('Parse error:', e.message);
            }}
        }}
    }}
    """

    # Actually, let's use a simpler approach - read the actual exported data
    # by creating a simple extractor

    return []


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

            if response.status_code in [200, 201]:
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
        return {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.token}",
        }

    def get_sprints(self) -> List[Dict]:
        response = requests.get(f"{self.base_url}/sprints", headers=self._headers())
        return response.json() if response.status_code == 200 else []

    def create_sprint(self, name: str) -> Optional[Dict]:
        response = requests.post(
            f"{self.base_url}/sprints",
            json={"name": name, "description": f"Problems from {name}"},
            headers=self._headers(),
        )
        if response.status_code in [200, 201]:
            sprint = response.json()
            console.print(f"[green]✓ Created sprint: {sprint['name']}[/green]")
            return sprint
        console.print(f"[red]Failed to create sprint: {response.text}[/red]")
        return None

    def get_or_create_sprint(self, name: str) -> Optional[str]:
        for sprint in self.get_sprints():
            if sprint.get('name', '').lower() == name.lower():
                console.print(f"[dim]Found existing sprint: {name}[/dim]")
                return sprint['id']
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
            console.print(f"[yellow]Failed to create problem: {response.text[:100]}[/yellow]")
            return None

    def import_problems(self, problems: List[Dict], sprint_id: Optional[str] = None) -> Dict:
        """Import multiple problems."""
        created = []
        failed = []

        for i, problem in enumerate(problems):
            result = self.create_problem(problem, sprint_id)
            if result:
                created.append(result)
                console.print(f"[green]✓ [{i+1}/{len(problems)}] {problem.get('title', 'Untitled')[:50]}...[/green]")
            else:
                failed.append(problem)

        return {"imported": len(created), "failed": len(failed)}


def load_sample_problems_json() -> List[Dict]:
    """
    Load sample problems from a pre-generated JSON file if available,
    or extract from TypeScript.
    """
    # Check for pre-generated JSON
    json_path = Path(__file__).parent / "data" / "sample_problems.json"
    if json_path.exists():
        with open(json_path) as f:
            return json.load(f)

    # Fall back to parsing TypeScript (basic extraction)
    console.print("[dim]Extracting problems from TypeScript file...[/dim]")
    return extract_problems_from_ts(SAMPLE_PROBLEMS_PATH)


def main():
    parser = argparse.ArgumentParser(description="Import sample problems to Nova API")
    parser.add_argument("--sprint", default="Sprint 1", help="Sprint name (default: Sprint 1)")
    parser.add_argument("--api-url", default=DEFAULT_API_URL, help="Nova API URL")
    parser.add_argument("--email", default="admin@demo.com", help="Admin email")
    parser.add_argument("--password", default="password123", help="Admin password")
    parser.add_argument("--json", help="Path to JSON file with problems (optional)")

    args = parser.parse_args()

    # Load problems
    if args.json:
        with open(args.json) as f:
            data = json.load(f)
            problems = data.get("problems", data) if isinstance(data, dict) else data
    else:
        problems = load_sample_problems_json()

    if not problems:
        console.print("[red]No problems found to import[/red]")
        console.print("[dim]Try running: node -e \"...\" to generate sample_problems.json[/dim]")
        sys.exit(1)

    console.print(f"[cyan]Found {len(problems)} problems to import[/cyan]")

    # Connect to API
    client = NovaApiClient(args.api_url, args.email, args.password)
    if not client.login():
        sys.exit(1)

    # Get or create sprint
    sprint_id = client.get_or_create_sprint(args.sprint)
    if not sprint_id:
        console.print("[red]Failed to get/create sprint[/red]")
        sys.exit(1)

    # Import problems
    result = client.import_problems(problems, sprint_id)

    console.print(f"\n[bold green]✓ Imported {result['imported']} problems to '{args.sprint}'[/bold green]")
    if result['failed']:
        console.print(f"[yellow]  {result['failed']} problems failed[/yellow]")


if __name__ == "__main__":
    main()
