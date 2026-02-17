import type { Survey } from "../_lib/types";

export const surveys: Survey[] = [
  {
    id: "srv_1",
    name: "Product NPS Q1 2026",
    type: "nps",
    status: "active",
    responseCount: 2840,
    responseRate: 34.2,
    results: {
      npsScore: 72,
      npsBreakdown: { detractors: 8, passives: 20, promoters: 72 },
    },
  },
  {
    id: "srv_2",
    name: "Support Satisfaction",
    type: "csat",
    status: "active",
    responseCount: 1560,
    responseRate: 48.5,
    results: {
      csatScore: 4.3,
    },
  },
  {
    id: "srv_3",
    name: "Feature Priority Poll",
    type: "multiple_choice",
    status: "completed",
    responseCount: 3200,
    responseRate: 28.1,
    results: {
      choices: [
        { label: "AI-powered insights", count: 1120 },
        { label: "Advanced dashboards", count: 840 },
        { label: "Mobile app", count: 620 },
        { label: "API improvements", count: 420 },
        { label: "Collaboration tools", count: 200 },
      ],
    },
  },
  {
    id: "srv_4",
    name: "Onboarding Feedback",
    type: "open_text",
    status: "active",
    responseCount: 890,
    responseRate: 22.3,
    results: {
      responses: [
        { text: "The setup wizard was really intuitive. Took me less than 5 minutes to get started.", timestamp: "2026-02-17T14:30:00Z" },
        { text: "Would love to see more video tutorials during onboarding.", timestamp: "2026-02-16T09:15:00Z" },
        { text: "The integration setup was confusing. I had to check the docs multiple times.", timestamp: "2026-02-15T16:45:00Z" },
        { text: "Great experience overall! The sample data really helped me understand the product.", timestamp: "2026-02-14T11:20:00Z" },
        { text: "I wish there was a way to skip the onboarding and go straight to the dashboard.", timestamp: "2026-02-13T08:00:00Z" },
      ],
    },
  },
  {
    id: "srv_5",
    name: "Dashboard Redesign Feedback",
    type: "nps",
    status: "completed",
    responseCount: 1200,
    responseRate: 41.0,
    results: {
      npsScore: 65,
      npsBreakdown: { detractors: 12, passives: 23, promoters: 65 },
    },
  },
  {
    id: "srv_6",
    name: "Checkout UX Survey",
    type: "csat",
    status: "draft",
    responseCount: 0,
    responseRate: 0,
    results: {
      csatScore: 0,
    },
  },
];
