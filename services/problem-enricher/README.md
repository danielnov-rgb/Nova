# Nova Problem Enricher

A Python CLI tool that reads problems from Excel files, enriches them using Claude API, and outputs structured data ready for Nova import.

## Features

- **Excel Parsing**: Auto-detects columns for title, description, context, and existing scores
- **AI Enrichment**: Uses Claude to generate detailed analysis with 11-dimensional scoring
- **Multiple Output Formats**: JSON, CSV, or TypeScript
- **Resume Capability**: Start from any row to resume interrupted processing
- **Token Tracking**: Monitors API usage for cost awareness
- **Dry Run Mode**: Preview extraction without API calls

## Installation

```bash
cd services/problem-enricher

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure API key
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

## Usage

### Basic Usage

```bash
# Enrich problems from Excel
python enricher.py --input problems.xlsx

# Preview what will be extracted (no API calls)
python enricher.py --input problems.xlsx --preview

# Dry run to test extraction
python enricher.py --input problems.xlsx --dry-run
```

### Options

```bash
python enricher.py --help

Options:
  --input, -i       Path to Excel file (required)
  --sheet           Sheet name (auto-detects if not specified)
  --output-dir, -o  Output directory (default: data/output)
  --format, -f      Output format: json, csv, typescript (default: json)
  --dry-run         Preview without API calls
  --start-row       Start from row N (for resume)
  --limit           Process only N problems
  --context         Path to business context file
  --model           Claude model (default: claude-sonnet-4-20250514)
  --verbose, -v     Detailed logging
  --preview         Show first 3 problems and exit
```

### Examples

```bash
# Process specific rows
python enricher.py --input problems.xlsx --start-row 10 --limit 5

# Output as TypeScript (can be directly imported in Nova)
python enricher.py --input problems.xlsx --format typescript

# Use custom business context
python enricher.py --input problems.xlsx --context context.txt

# Verbose mode for debugging
python enricher.py --input problems.xlsx --verbose
```

## Excel Format

The parser auto-detects columns based on common names:

| Column Type | Detected Names |
|-------------|----------------|
| Title | title, problem, name, issue, topic |
| Description | description, desc, details, summary, notes |
| Context | context, background, additional, info |
| Scores | score, rating, priority, severity, impact |
| Evidence | evidence, quote, feedback, comment, insight |

If auto-detection fails, you can manually specify column mappings in the code.

## Output Format

### JSON Output

```json
{
  "batch_id": "batch_20240211_143022",
  "source_file": "problems.xlsx",
  "processed_at": "2024-02-11T14:30:22Z",
  "total_problems": 17,
  "problems": [
    {
      "id": "prob-abc123",
      "title": "The Evidence Deficit",
      "description": "...",
      "hypothesis": "We believe that...",
      "scores": {
        "applicability": { "value": 100, "justification": "..." },
        ...
      },
      "evidenceItems": [...],
      "tags": ["career", "portfolio"]
    }
  ]
}
```

### 11-Dimensional Scoring

Each problem is scored on:

**Core (40-50% weight)**
- applicability - % of target users affected
- severity - Pain level when encountered
- frequency - How often it occurs
- willingnessToPay - Monetization potential

**Strategic (30-40% weight)**
- retentionImpact - Effect on user retention
- acquisitionPotential - New user attraction
- viralCoefficient - Word-of-mouth potential
- strategicFit - Alignment with strategy

**Execution (15-20% weight)**
- feasibility - Ease of implementation
- timeToValue - Speed to deliver value
- riskLevel - Implementation risk (higher = safer)

## Importing to Nova

### Option 1: Copy TypeScript file

```bash
python enricher.py --input problems.xlsx --format typescript
cp data/output/enriched_problems_*.ts apps/web/app/admin/problems/_data/
```

### Option 2: API Import (if endpoint exists)

```bash
# POST to Nova API
curl -X POST http://localhost:3001/api/problems/bulk-import \
  -H "Content-Type: application/json" \
  -d @data/output/enriched_problems_*.json
```

## File Structure

```
services/problem-enricher/
├── enricher.py         # CLI entry point
├── excel_parser.py     # Excel file parsing
├── claude_enricher.py  # Claude API integration
├── output_writer.py    # JSON/CSV/TS output
├── schema.py           # Pydantic models
├── prompts.py          # Enrichment prompts
├── requirements.txt    # Python dependencies
├── .env.example        # Environment template
├── data/
│   ├── input/          # Drop Excel files here
│   └── output/         # Enriched output appears here
└── README.md
```

## Development

```bash
# Run tests
python -m pytest

# Type checking
mypy .

# Format code
black .
```
