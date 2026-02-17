import type { PathsPageData } from "../_lib/types";

export const pathsData: PathsPageData = {
  nodes: [
    // Level 0 — entry
    { id: "home", name: "Homepage", level: 0, count: 8400, y: 0.5 },
    // Level 1
    { id: "pricing", name: "Pricing", level: 1, count: 3200, y: 0.2 },
    { id: "features", name: "Features", level: 1, count: 2800, y: 0.5 },
    { id: "docs", name: "Docs", level: 1, count: 1600, y: 0.8 },
    // Level 2
    { id: "signup", name: "Sign Up", level: 2, count: 2400, y: 0.15 },
    { id: "demo", name: "Book Demo", level: 2, count: 1100, y: 0.4 },
    { id: "blog", name: "Blog", level: 2, count: 900, y: 0.6 },
    { id: "api-docs", name: "API Docs", level: 2, count: 1200, y: 0.85 },
    // Level 3
    { id: "onboarding", name: "Onboarding", level: 3, count: 1800, y: 0.2 },
    { id: "dashboard", name: "Dashboard", level: 3, count: 1400, y: 0.5 },
    { id: "exit", name: "Exit", level: 3, count: 2100, y: 0.8 },
  ],
  edges: [
    { source: "home", target: "pricing", count: 3200 },
    { source: "home", target: "features", count: 2800 },
    { source: "home", target: "docs", count: 1600 },
    { source: "pricing", target: "signup", count: 1800 },
    { source: "pricing", target: "demo", count: 900 },
    { source: "pricing", target: "exit", count: 500 },
    { source: "features", target: "signup", count: 600 },
    { source: "features", target: "demo", count: 200 },
    { source: "features", target: "blog", count: 900 },
    { source: "features", target: "exit", count: 1100 },
    { source: "docs", target: "api-docs", count: 1200 },
    { source: "docs", target: "exit", count: 400 },
    { source: "signup", target: "onboarding", count: 1800 },
    { source: "demo", target: "exit", count: 100 },
    { source: "demo", target: "onboarding", count: 0 },
    { source: "onboarding", target: "dashboard", count: 1400 },
    { source: "api-docs", target: "dashboard", count: 0 },
  ].filter((e) => e.count > 0),
  topPaths: [
    { steps: ["Homepage", "Pricing", "Sign Up", "Onboarding", "Dashboard"], users: 1200, conversion: 14.3, avgTime: "6m 20s" },
    { steps: ["Homepage", "Features", "Blog", "Exit"], users: 900, conversion: 0, avgTime: "3m 45s" },
    { steps: ["Homepage", "Pricing", "Demo"], users: 900, conversion: 10.7, avgTime: "4m 10s" },
    { steps: ["Homepage", "Features", "Sign Up", "Onboarding"], users: 600, conversion: 7.1, avgTime: "5m 50s" },
    { steps: ["Homepage", "Docs", "API Docs", "Dashboard"], users: 480, conversion: 5.7, avgTime: "8m 15s" },
    { steps: ["Homepage", "Pricing", "Exit"], users: 500, conversion: 0, avgTime: "1m 30s" },
    { steps: ["Homepage", "Features", "Exit"], users: 1100, conversion: 0, avgTime: "2m 05s" },
    { steps: ["Homepage", "Docs", "Exit"], users: 400, conversion: 0, avgTime: "1m 50s" },
  ],
};
