// Market Data Types
export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  marketCap: number;
  sparkline: number[];
  status: "active" | "halted" | "closed";
  lastUpdate: Date;
}

export interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Alert Types
export type AlertSeverity = "critical" | "warning" | "info";
export type AlertStatus = "active" | "triggered" | "resolved" | "snoozed";

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  asset?: string;
  threshold?: number;
  currentValue?: number;
  triggeredAt?: Date;
  createdAt: Date;
  resolvedAt?: Date;
}

// Worker Types
export type WorkerStatus = "healthy" | "degraded" | "down" | "starting";
export type WorkerType = "ingestion" | "processor" | "evaluator" | "writer" | "ai-agent";

export interface Worker {
  id: string;
  name: string;
  type: WorkerType;
  status: WorkerStatus;
  cpu: number;
  memory: number;
  uptime: number;
  processedCount: number;
  errorRate: number;
  lastHeartbeat: Date;
}

// Metrics Types
export interface SystemMetrics {
  queueDepth: number;
  ticksPerSec: number;
  redisOpsPerSec: number;
  dbLatencyMs: number;
  cpuUsage: number;
  memoryUsage: number;
  networkIn: number;
  networkOut: number;
}

export interface TimeSeriesPoint {
  timestamp: number;
  value: number;
}

export interface MetricSeries {
  name: string;
  data: TimeSeriesPoint[];
  unit: string;
}

// AI Insights Types
export type InsightType = "anomaly" | "volatility" | "trend" | "prediction" | "event";

export interface AIInsight {
  id: string;
  type: InsightType;
  title: string;
  summary: string;
  confidence: number;
  relatedAssets: string[];
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "alert" | "system" | "insight";
  read: boolean;
  timestamp: Date;
}

// Navigation Types
export type NavItem = {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
};
