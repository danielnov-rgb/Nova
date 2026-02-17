"""
Prompts for Claude-powered problem enrichment.
"""

from typing import Optional, List, Dict

SYSTEM_PROMPT = """You are an expert product strategist and market researcher. Your task is to enrich raw problem statements with detailed analysis, scores, and evidence.

You work for a product intelligence platform that helps teams prioritize which problems to solve. Your enrichments should be:
- Data-driven and objective
- Grounded in product management best practices
- Realistic and actionable
- Clear and well-justified

When scoring problems (0-100 scale):
- 0-20: Very low / Not applicable
- 21-40: Below average
- 41-60: Average / Moderate
- 61-80: Above average / High
- 81-100: Very high / Critical

Always provide clear justifications for your scores that reference specific aspects of the problem."""


def get_enrichment_prompt(
    title: Optional[str],
    description: Optional[str],
    context: Optional[str] = None,
    existing_evidence: Optional[List[str]] = None,
    business_context: Optional[str] = None
) -> str:
    """
    Generate the enrichment prompt for a single problem.

    Args:
        title: Problem title (may be None)
        description: Problem description (may be None)
        context: Additional context from Excel
        existing_evidence: Pre-existing evidence to preserve
        business_context: Optional business/product context

    Returns:
        The prompt string for Claude
    """
    # Build the problem section
    problem_parts = []

    if title:
        problem_parts.append(f"**Title:** {title}")

    if description:
        problem_parts.append(f"**Description:** {description}")

    if context:
        problem_parts.append(f"**Additional Context:** {context}")

    if existing_evidence:
        evidence_text = "\n".join(f"- {e}" for e in existing_evidence)
        problem_parts.append(f"**Existing Evidence:**\n{evidence_text}")

    problem_text = "\n\n".join(problem_parts)

    # Build optional business context section
    context_section = ""
    if business_context:
        context_section = f"""
## Business Context
{business_context}

"""

    return f"""## Task
Enrich the following raw problem statement with detailed analysis, scores, and evidence.
{context_section}
## Raw Problem
{problem_text}

## Required Output
Provide a JSON object with the following structure:

```json
{{
  "title": "Clear, concise problem title (keep existing if good, improve if vague)",
  "description": "Expanded 2-3 sentence description explaining the problem in detail",
  "hypothesis": "We believe that [solving this problem] will [achieve outcome] for [target users] because [reasoning]",
  "tags": ["tag1", "tag2", "tag3"],
  "evidence_summary": "2-3 sentence summary of why this problem matters and what evidence supports it",
  "evidence_items": [
    {{
      "type": "MARKET_RESEARCH|EXPERT_OPINION|ANALYTICS_DATA|INTERVIEW_QUOTE|OBSERVATION|OTHER",
      "content": "The specific evidence or insight",
      "source": "Where this evidence comes from",
      "sentiment": "POSITIVE|NEGATIVE|NEUTRAL",
      "weight": 0.0-1.0
    }}
  ],
  "scores": {{
    "applicability": {{
      "value": 0-100,
      "justification": "Why this score? What % of target users are affected?"
    }},
    "severity": {{
      "value": 0-100,
      "justification": "How painful is this problem when encountered?"
    }},
    "frequency": {{
      "value": 0-100,
      "justification": "How often does this problem occur for affected users?"
    }},
    "willingness_to_pay": {{
      "value": 0-100,
      "justification": "Would users pay to solve this? Evidence of monetization potential?"
    }},
    "retention_impact": {{
      "value": 0-100,
      "justification": "Does solving this improve user retention?"
    }},
    "acquisition_potential": {{
      "value": 0-100,
      "justification": "Can this attract new users? Is it a key selling point?"
    }},
    "viral_coefficient": {{
      "value": 0-100,
      "justification": "Does solving this drive word-of-mouth or sharing?"
    }},
    "strategic_fit": {{
      "value": 0-100,
      "justification": "How well does this align with typical product strategy?"
    }},
    "feasibility": {{
      "value": 0-100,
      "justification": "How easy is it to build a solution? (higher = easier)"
    }},
    "time_to_value": {{
      "value": 0-100,
      "justification": "How quickly can we deliver value? (higher = faster)"
    }},
    "risk_level": {{
      "value": 0-100,
      "justification": "Implementation risk level (higher = less risky)"
    }}
  }}
}}
```

## Guidelines

1. **Title**: If the existing title is clear and specific, keep it. If vague, create a more descriptive one.

2. **Description**: Expand on the raw description to clearly articulate:
   - Who experiences this problem
   - What the problem actually is
   - Why it matters

3. **Hypothesis**: Follow the format "We believe that [action] will [outcome] for [users] because [reason]"

4. **Tags**: Generate 3-5 relevant tags for categorization (e.g., "ux", "onboarding", "mobile", "enterprise", "retention")

5. **Evidence Items**: Generate 2-4 evidence items. Types include:
   - MARKET_RESEARCH: Industry data, market trends
   - EXPERT_OPINION: Professional insights
   - ANALYTICS_DATA: Usage patterns, metrics
   - INTERVIEW_QUOTE: User feedback (can be synthesized)
   - OBSERVATION: Behavioral observations
   - OTHER: Anything else relevant

6. **Scores**: Be realistic and differentiated. Not everything is a 50. Use the full 0-100 range based on the actual problem characteristics.

7. **Preserve existing evidence**: If existing evidence was provided, incorporate and expand on it.

Respond ONLY with the JSON object, no additional text."""


DEFAULT_BUSINESS_CONTEXT = """
This is a B2B SaaS product intelligence platform. The target users are:
- Product managers prioritizing features
- Founders validating problem-solution fit
- Research teams synthesizing user feedback

Key considerations:
- Solutions should be scalable across multiple teams
- Enterprise features (SSO, permissions) are valuable
- Integration with existing workflows matters
- Data security and privacy are important
"""


def get_batch_summary_prompt(problems_summary: List[Dict]) -> str:
    """
    Generate a prompt for summarizing a batch of enriched problems.

    Args:
        problems_summary: List of {title, priority_score} dicts

    Returns:
        Prompt for generating batch insights
    """
    problems_text = "\n".join(
        f"- {p['title']} (Priority: {p['priority_score']:.1f})"
        for p in problems_summary
    )

    return f"""## Task
Analyze this batch of enriched problems and provide strategic insights.

## Problems (sorted by priority)
{problems_text}

## Required Output
Provide a JSON object with:
```json
{{
  "top_themes": ["theme1", "theme2", "theme3"],
  "recommended_focus": "Which problem or theme should be prioritized and why",
  "quick_wins": ["problem titles that are high impact + high feasibility"],
  "strategic_bets": ["problem titles that are high impact but harder to solve"],
  "insights": "2-3 paragraph strategic analysis of what these problems reveal"
}}
```

Respond ONLY with the JSON object."""
