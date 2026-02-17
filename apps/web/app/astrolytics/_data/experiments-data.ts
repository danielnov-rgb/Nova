import type { Experiment } from "../_lib/types";

export const experiments: Experiment[] = [
  {
    id: "exp_1",
    name: "Checkout Flow Redesign",
    description: "Testing single-page checkout vs multi-step checkout for conversion improvement.",
    status: "completed",
    startDate: "Jan 5, 2026",
    endDate: "Feb 5, 2026",
    winner: "single-page",
    variants: [
      { key: "control", name: "Multi-step (Control)", users: 4820, conversion: 3.2, improvement: 0, significance: 100 },
      { key: "single-page", name: "Single Page", users: 4795, conversion: 4.1, improvement: 28.1, significance: 97.3 },
    ],
    cumulativeData: [
      { date: "Jan 5", control: 2.8, test: 3.0 },
      { date: "Jan 12", control: 3.0, test: 3.4 },
      { date: "Jan 19", control: 3.1, test: 3.7 },
      { date: "Jan 26", control: 3.2, test: 3.9 },
      { date: "Feb 2", control: 3.2, test: 4.1 },
    ],
  },
  {
    id: "exp_2",
    name: "Onboarding Tooltip Tour",
    description: "Interactive product tour during first session vs static help docs.",
    status: "running",
    startDate: "Feb 1, 2026",
    variants: [
      { key: "control", name: "Help Docs (Control)", users: 2340, conversion: 45.2, improvement: 0, significance: 100 },
      { key: "tour", name: "Interactive Tour", users: 2285, conversion: 52.8, improvement: 16.8, significance: 89.4 },
    ],
    cumulativeData: [
      { date: "Feb 1", control: 40.0, test: 42.0 },
      { date: "Feb 8", control: 43.5, test: 48.2 },
      { date: "Feb 15", control: 45.2, test: 52.8 },
    ],
  },
  {
    id: "exp_3",
    name: "Pricing Page CTA Color",
    description: "Testing green vs blue CTA button on pricing page for higher click-through.",
    status: "completed",
    startDate: "Dec 15, 2025",
    endDate: "Jan 15, 2026",
    winner: "green-cta",
    variants: [
      { key: "control", name: "Blue CTA (Control)", users: 6100, conversion: 12.4, improvement: 0, significance: 100 },
      { key: "green-cta", name: "Green CTA", users: 6050, conversion: 14.8, improvement: 19.4, significance: 99.1 },
    ],
    cumulativeData: [
      { date: "Dec 15", control: 11.0, test: 12.5 },
      { date: "Dec 22", control: 11.8, test: 13.8 },
      { date: "Dec 29", control: 12.1, test: 14.2 },
      { date: "Jan 5", control: 12.3, test: 14.6 },
      { date: "Jan 12", control: 12.4, test: 14.8 },
    ],
  },
  {
    id: "exp_4",
    name: "Email Subject Line Test",
    description: "Personalized subject lines vs generic for weekly digest email open rates.",
    status: "running",
    startDate: "Feb 10, 2026",
    variants: [
      { key: "control", name: "Generic (Control)", users: 8200, conversion: 22.1, improvement: 0, significance: 100 },
      { key: "personalized", name: "Personalized", users: 8150, conversion: 24.5, improvement: 10.9, significance: 76.2 },
    ],
    cumulativeData: [
      { date: "Feb 10", control: 20.5, test: 23.0 },
      { date: "Feb 17", control: 22.1, test: 24.5 },
    ],
  },
  {
    id: "exp_5",
    name: "Dashboard Widget Layout",
    description: "Compact 4-column grid vs spacious 2-column layout for dashboard engagement.",
    status: "draft",
    startDate: "Mar 1, 2026",
    variants: [
      { key: "control", name: "4-Column (Control)", users: 0, conversion: 0, improvement: 0, significance: 0 },
      { key: "spacious", name: "2-Column Spacious", users: 0, conversion: 0, improvement: 0, significance: 0 },
    ],
    cumulativeData: [],
  },
];
