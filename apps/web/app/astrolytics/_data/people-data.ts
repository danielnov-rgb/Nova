import type { Person } from "../_lib/types";

const countries = ["United States", "United Kingdom", "Germany", "Canada", "Australia", "France", "Japan", "Brazil"];
const firstNames = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Quinn", "Avery", "Harper", "Reese", "Devon", "Blair", "Sage", "Ellis", "Finley", "Rowan", "Emery", "Cameron", "Dakota", "Skyler"];
const lastNames = ["Chen", "Rodriguez", "Patel", "Kim", "Okafor", "Müller", "Tanaka", "Silva", "Dubois", "Anderson", "Williams", "Johnson", "Brown", "Davis", "Martinez", "Thompson", "Garcia", "Wilson", "Moore", "Taylor"];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePerson(index: number): Person {
  const first = randomItem(firstNames);
  const last = randomItem(lastNames);
  const id = `usr_${(1000 + index).toString(36)}`;
  const events = Math.floor(Math.random() * 400) + 10;
  const sessions = Math.floor(events / (3 + Math.random() * 5));
  const isActive = Math.random() > 0.3;
  const daysAgo = isActive ? Math.floor(Math.random() * 7) : Math.floor(Math.random() * 60) + 7;

  const activityData = Array.from({ length: 14 }, (_, i) => {
    const d = new Date("2026-02-03");
    d.setDate(d.getDate() + i);
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      events: Math.floor(Math.random() * (isActive ? 30 : 5)),
    };
  });

  const eventTypes = ["Page View", "Button Click", "Form Submit", "Search", "File Upload", "Sign In", "Settings Change", "Purchase"];
  const recentEvents = Array.from({ length: 8 }, (_, i) => {
    const d = new Date("2026-02-17");
    d.setDate(d.getDate() - i);
    d.setHours(Math.floor(Math.random() * 14) + 8, Math.floor(Math.random() * 60));
    return {
      event: randomItem(eventTypes),
      timestamp: d.toISOString(),
    };
  });

  return {
    id,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
    firstSeen: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    lastSeen: `${daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo}d ago`}`,
    eventCount30d: events,
    sessionCount: sessions,
    country: randomItem(countries),
    status: isActive ? "active" : "inactive",
    properties: {
      Browser: randomItem(["Chrome", "Firefox", "Safari", "Edge"]),
      OS: randomItem(["macOS", "Windows", "Linux", "iOS", "Android"]),
      "Screen Size": randomItem(["1920x1080", "1440x900", "2560x1440", "1366x768"]),
      Plan: randomItem(["Free", "Pro", "Enterprise"]),
      Role: randomItem(["Admin", "Editor", "Viewer"]),
    },
    recentEvents,
    cohorts: [
      ...(isActive ? ["Active Users"] : ["Churned Users"]),
      ...(events > 200 ? ["Power Users"] : []),
      ...(Math.random() > 0.6 ? ["Beta Testers"] : []),
    ],
    featureFlags: [
      { name: "new-dashboard", value: Math.random() > 0.5 },
      { name: "dark-mode", value: true },
      { name: "ai-insights", value: Math.random() > 0.3 },
    ],
    activityData,
  };
}

export const people: Person[] = Array.from({ length: 50 }, (_, i) => generatePerson(i));
