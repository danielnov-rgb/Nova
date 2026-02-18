import type Anthropic from '@anthropic-ai/sdk';

export const strategyTools: Anthropic.Tool[] = [
  {
    name: 'update_objectives',
    description:
      'Fill in the Business Objectives field on the Strategy Agent page. Use when the user describes their goals, KPIs, or north star metrics.',
    input_schema: {
      type: 'object' as const,
      properties: {
        text: {
          type: 'string',
          description: 'The business objectives text to fill into the form field',
        },
      },
      required: ['text'],
    },
  },
  {
    name: 'update_business_model',
    description:
      'Fill in the Business Model field. Use when the user describes how their business works, revenue model, pricing, or go-to-market.',
    input_schema: {
      type: 'object' as const,
      properties: {
        text: {
          type: 'string',
          description: 'The business model description',
        },
      },
      required: ['text'],
    },
  },
  {
    name: 'update_competitive_advantages',
    description:
      'Fill in the Competitive Advantages field. Use when the user describes what makes them unique, their moat, or differentiators.',
    input_schema: {
      type: 'object' as const,
      properties: {
        text: {
          type: 'string',
          description: 'The competitive advantages text',
        },
      },
      required: ['text'],
    },
  },
  {
    name: 'update_existing_problems',
    description:
      'Fill in the Known Challenges field. Use when the user describes pain points, bottlenecks, or problems they face.',
    input_schema: {
      type: 'object' as const,
      properties: {
        text: {
          type: 'string',
          description: 'The known challenges text',
        },
      },
      required: ['text'],
    },
  },
  {
    name: 'add_terminology',
    description:
      'Add a term and its definition to the terminology glossary. Use when the user explains domain-specific jargon or acronyms.',
    input_schema: {
      type: 'object' as const,
      properties: {
        term: {
          type: 'string',
          description: 'The term to add',
        },
        definition: {
          type: 'string',
          description: 'The definition of the term',
        },
      },
      required: ['term', 'definition'],
    },
  },
];
