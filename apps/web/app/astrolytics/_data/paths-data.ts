import type { PathsPageData } from "../_lib/types";

export const pathsData: PathsPageData = {
  nodes: [
    // Level 0 — entry
    { id: "home", name: "Home", level: 0, count: 12400, y: 0.5 },
    // Level 1
    { id: "browse-paths", name: "Browse Paths", level: 1, count: 5200, y: 0.2 },
    { id: "my-progress", name: "My Progress", level: 1, count: 3800, y: 0.5 },
    { id: "evidence-portfolio", name: "Evidence Portfolio", level: 1, count: 2100, y: 0.8 },
    // Level 2
    { id: "path-detail", name: "Path Detail", level: 2, count: 3800, y: 0.15 },
    { id: "milestone", name: "Milestone", level: 2, count: 2400, y: 0.4 },
    { id: "ai-tools", name: "AI Tools", level: 2, count: 1600, y: 0.65 },
    { id: "exit", name: "Exit", level: 2, count: 1900, y: 0.9 },
    // Level 3
    { id: "go-card", name: "Go-Card", level: 3, count: 3200, y: 0.15 },
    { id: "cv-builder", name: "CV Builder", level: 3, count: 1100, y: 0.4 },
    { id: "mydna", name: "MyDNA", level: 3, count: 850, y: 0.65 },
    { id: "exit-deep", name: "Exit", level: 3, count: 1400, y: 0.9 },
  ],
  edges: [
    { source: "home", target: "browse-paths", count: 5200 },
    { source: "home", target: "my-progress", count: 3800 },
    { source: "home", target: "evidence-portfolio", count: 2100 },
    { source: "browse-paths", target: "path-detail", count: 3800 },
    { source: "browse-paths", target: "exit", count: 1400 },
    { source: "my-progress", target: "milestone", count: 2400 },
    { source: "my-progress", target: "go-card", count: 800 },
    { source: "my-progress", target: "exit", count: 600 },
    { source: "evidence-portfolio", target: "ai-tools", count: 1200 },
    { source: "evidence-portfolio", target: "exit", count: 900 },
    { source: "path-detail", target: "go-card", count: 2400 },
    { source: "path-detail", target: "exit-deep", count: 1400 },
    { source: "milestone", target: "go-card", count: 1800 },
    { source: "milestone", target: "exit-deep", count: 600 },
    { source: "ai-tools", target: "cv-builder", count: 1100 },
    { source: "ai-tools", target: "mydna", count: 500 },
  ].filter((e) => e.count > 0),
  topPaths: [
    { steps: ["Home", "Browse Paths", "Path Detail", "Go-Card"], users: 2400, conversion: 19.4, avgTime: "5m 40s" },
    { steps: ["Home", "My Progress", "Milestone", "Go-Card"], users: 1800, conversion: 14.5, avgTime: "4m 20s" },
    { steps: ["Home", "Evidence Portfolio", "AI Tools", "CV Builder"], users: 1100, conversion: 8.9, avgTime: "6m 50s" },
    { steps: ["Home", "My Progress", "Go-Card"], users: 800, conversion: 6.5, avgTime: "3m 15s" },
    { steps: ["Home", "Browse Paths", "Exit"], users: 1400, conversion: 0, avgTime: "1m 45s" },
    { steps: ["Home", "Evidence Portfolio", "AI Tools", "MyDNA"], users: 500, conversion: 4.0, avgTime: "7m 30s" },
    { steps: ["Home", "Evidence Portfolio", "Exit"], users: 900, conversion: 0, avgTime: "2m 10s" },
    { steps: ["Home", "My Progress", "Milestone", "Exit"], users: 600, conversion: 0, avgTime: "2m 55s" },
  ],
};
