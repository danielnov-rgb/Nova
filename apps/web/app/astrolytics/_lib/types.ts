// ============================================
// Astrolytics Type Definitions
// ============================================

// --- Dashboard ---
export interface DashboardMetric {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
}

export interface DashboardData {
  metrics: DashboardMetric[];
  userActivity: { date: string; dau: number; wau: number; mau: number }[];
  topEvents: { name: string; count: number; change: number }[];
  weeklyActiveUsers: { week: string; users: number }[];
  recentFlags: { name: string; status: "active" | "paused"; rollout: number }[];
  activeExperiments: { name: string; variant: string; improvement: number }[];
  insights: { text: string; type: "positive" | "neutral" | "warning" }[];
}

// --- Trends ---
export interface TrendSeries {
  name: string;
  data: { date: string; value: number }[];
}

export interface TrendsPageData {
  events: string[];
  breakdowns: string[];
  series: TrendSeries[];
  tableData: Record<string, string | number>[];
}

// --- Funnels ---
export interface FunnelStep {
  name: string;
  count: number;
  conversionRate: number;
  dropOff: number;
  medianTime: string;
}

export interface FunnelsPageData {
  steps: FunnelStep[];
  conversionOverTime: { week: string; rate: number }[];
  breakdown: { property: string; rate: number }[];
}

// --- Retention ---
export interface RetentionCohort {
  period: string;
  totalUsers: number;
  retention: number[];
}

export interface RetentionPageData {
  cohorts: RetentionCohort[];
  retentionCurve: { day: number; rate: number }[];
  summaryMetrics: { label: string; value: string }[];
}

// --- Paths ---
export interface PathNode {
  id: string;
  name: string;
  level: number;
  count: number;
  y: number;
}

export interface PathEdge {
  source: string;
  target: string;
  count: number;
}

export interface PathsPageData {
  nodes: PathNode[];
  edges: PathEdge[];
  topPaths: { steps: string[]; users: number; conversion: number; avgTime: string }[];
}

// --- Lifecycle ---
export interface LifecycleWeek {
  week: string;
  new: number;
  returning: number;
  resurrecting: number;
  dormant: number;
}

export interface LifecyclePageData {
  weeks: LifecycleWeek[];
  metrics: { label: string; value: string; change: number }[];
}

// --- People ---
export interface Person {
  id: string;
  name: string;
  email: string;
  firstSeen: string;
  lastSeen: string;
  eventCount30d: number;
  sessionCount: number;
  country: string;
  status: "active" | "inactive";
  properties: Record<string, string>;
  recentEvents: { event: string; timestamp: string; properties?: Record<string, string> }[];
  cohorts: string[];
  featureFlags: { name: string; value: boolean | string }[];
  activityData: { date: string; events: number }[];
}

// --- Cohorts ---
export interface Cohort {
  id: string;
  name: string;
  type: "static" | "dynamic";
  size: number;
  created: string;
  lastCalculated: string;
  filters: string;
  sizeOverTime: { date: string; size: number }[];
}

// --- Feature Flags ---
export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  type: "boolean" | "multivariate";
  status: "active" | "paused" | "draft";
  rolloutPercentage: number;
  variants?: { key: string; name: string; rollout: number }[];
  filters?: { property: string; operator: string; value: string }[];
  createdAt: string;
}

// --- Experiments ---
export interface ExperimentVariant {
  key: string;
  name: string;
  users: number;
  conversion: number;
  improvement: number;
  significance: number;
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  status: "running" | "completed" | "draft";
  startDate: string;
  endDate?: string;
  variants: ExperimentVariant[];
  winner?: string;
  cumulativeData: { date: string; control: number; test: number }[];
}

// --- Surveys ---
export interface Survey {
  id: string;
  name: string;
  type: "nps" | "csat" | "multiple_choice" | "open_text";
  status: "active" | "completed" | "draft";
  responseCount: number;
  responseRate: number;
  results: {
    npsScore?: number;
    npsBreakdown?: { detractors: number; passives: number; promoters: number };
    csatScore?: number;
    choices?: { label: string; count: number }[];
    responses?: { text: string; timestamp: string }[];
  };
}

// --- Session Replay ---
export interface SessionReplay {
  id: string;
  user: string;
  email?: string;
  duration: string;
  pagesViewed: number;
  events: number;
  startTime: string;
  country: string;
  eventTimeline: { time: string; event: string; detail?: string }[];
}

// --- Sidebar ---
export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}
