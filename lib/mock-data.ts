import type {
  MarketAsset,
  Alert,
  Worker,
  SystemMetrics,
  AIInsight,
  Notification,
} from "./types";

// Generate sparkline data
const generateSparkline = (
  basePrice: number,
  volatility: number = 0.02
): number[] => {
  const points: number[] = [];
  let price = basePrice * (1 - volatility * 10);
  for (let i = 0; i < 24; i++) {
    price = price * (1 + (Math.random() - 0.5) * volatility);
    points.push(price);
  }
  return points;
};

export const mockAssets: MarketAsset[] = [
  {
    id: "btc-usd",
    symbol: "BTC/USD",
    name: "Bitcoin",
    price: 67432.5,
    change24h: 2.34,
    volume24h: 28_500_000_000,
    high24h: 68120.0,
    low24h: 65890.0,
    marketCap: 1_325_000_000_000,
    sparkline: generateSparkline(67432.5),
    status: "active",
    lastUpdate: new Date(),
  },
  {
    id: "eth-usd",
    symbol: "ETH/USD",
    name: "Ethereum",
    price: 3521.8,
    change24h: -1.12,
    volume24h: 15_200_000_000,
    high24h: 3580.0,
    low24h: 3480.0,
    marketCap: 423_000_000_000,
    sparkline: generateSparkline(3521.8),
    status: "active",
    lastUpdate: new Date(),
  },
  {
    id: "sol-usd",
    symbol: "SOL/USD",
    name: "Solana",
    price: 178.42,
    change24h: 5.67,
    volume24h: 3_800_000_000,
    high24h: 182.0,
    low24h: 168.5,
    marketCap: 78_000_000_000,
    sparkline: generateSparkline(178.42, 0.03),
    status: "active",
    lastUpdate: new Date(),
  },
  {
    id: "aapl",
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 189.84,
    change24h: 0.45,
    volume24h: 52_000_000,
    high24h: 191.2,
    low24h: 188.5,
    marketCap: 2_950_000_000_000,
    sparkline: generateSparkline(189.84, 0.01),
    status: "active",
    lastUpdate: new Date(),
  },
  {
    id: "tsla",
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 248.5,
    change24h: -2.18,
    volume24h: 98_000_000,
    high24h: 255.0,
    low24h: 245.2,
    marketCap: 790_000_000_000,
    sparkline: generateSparkline(248.5, 0.025),
    status: "active",
    lastUpdate: new Date(),
  },
  {
    id: "nvda",
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 875.32,
    change24h: 3.21,
    volume24h: 42_000_000,
    high24h: 885.0,
    low24h: 850.0,
    marketCap: 2_150_000_000_000,
    sparkline: generateSparkline(875.32, 0.02),
    status: "active",
    lastUpdate: new Date(),
  },
];

export const mockAlerts: Alert[] = [
  {
    id: "alert-1",
    title: "BTC Price Threshold Exceeded",
    description: "Bitcoin crossed $67,000 resistance level",
    severity: "warning",
    status: "triggered",
    asset: "BTC/USD",
    threshold: 67000,
    currentValue: 67432.5,
    triggeredAt: new Date(Date.now() - 300000),
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: "alert-2",
    title: "High Volatility Detected",
    description: "SOL/USD showing unusual volatility patterns",
    severity: "critical",
    status: "active",
    asset: "SOL/USD",
    createdAt: new Date(Date.now() - 600000),
  },
  {
    id: "alert-3",
    title: "Queue Depth Warning",
    description: "Message queue depth exceeded 10,000",
    severity: "warning",
    status: "active",
    threshold: 10000,
    currentValue: 12450,
    createdAt: new Date(Date.now() - 1800000),
  },
  {
    id: "alert-4",
    title: "Worker Health Degraded",
    description: "Ingestion worker experiencing high latency",
    severity: "info",
    status: "resolved",
    createdAt: new Date(Date.now() - 7200000),
    resolvedAt: new Date(Date.now() - 3600000),
  },
];

export const mockWorkers: Worker[] = [
  {
    id: "worker-1",
    name: "Market Ingestion Primary",
    type: "ingestion",
    status: "healthy",
    cpu: 45,
    memory: 62,
    uptime: 432000,
    processedCount: 15_420_000,
    errorRate: 0.001,
    lastHeartbeat: new Date(),
  },
  {
    id: "worker-2",
    name: "Market Ingestion Secondary",
    type: "ingestion",
    status: "healthy",
    cpu: 38,
    memory: 55,
    uptime: 432000,
    processedCount: 14_890_000,
    errorRate: 0.002,
    lastHeartbeat: new Date(),
  },
  {
    id: "worker-3",
    name: "Stream Processor Alpha",
    type: "processor",
    status: "healthy",
    cpu: 72,
    memory: 78,
    uptime: 345600,
    processedCount: 28_500_000,
    errorRate: 0.0005,
    lastHeartbeat: new Date(),
  },
  {
    id: "worker-4",
    name: "Stream Processor Beta",
    type: "processor",
    status: "degraded",
    cpu: 89,
    memory: 85,
    uptime: 345600,
    processedCount: 26_200_000,
    errorRate: 0.015,
    lastHeartbeat: new Date(Date.now() - 5000),
  },
  {
    id: "worker-5",
    name: "Alert Evaluator",
    type: "evaluator",
    status: "healthy",
    cpu: 25,
    memory: 42,
    uptime: 518400,
    processedCount: 8_900_000,
    errorRate: 0.001,
    lastHeartbeat: new Date(),
  },
  {
    id: "worker-6",
    name: "Database Writer Pool",
    type: "writer",
    status: "healthy",
    cpu: 55,
    memory: 68,
    uptime: 259200,
    processedCount: 45_000_000,
    errorRate: 0.0001,
    lastHeartbeat: new Date(),
  },
  {
    id: "worker-7",
    name: "AI Analysis Agent",
    type: "ai-agent",
    status: "healthy",
    cpu: 65,
    memory: 82,
    uptime: 172800,
    processedCount: 125_000,
    errorRate: 0.005,
    lastHeartbeat: new Date(),
  },
];

export const mockMetrics: SystemMetrics = {
  queueDepth: 3420,
  ticksPerSec: 12450,
  redisOpsPerSec: 8920,
  dbLatencyMs: 2.4,
  cpuUsage: 54,
  memoryUsage: 67,
  networkIn: 125.6,
  networkOut: 89.2,
};

export const mockInsights: AIInsight[] = [
  {
    id: "insight-1",
    type: "anomaly",
    title: "Unusual Trading Volume",
    summary:
      "SOL/USD trading volume is 340% above 7-day average. This spike correlates with recent ecosystem announcements.",
    confidence: 0.92,
    relatedAssets: ["SOL/USD"],
    timestamp: new Date(Date.now() - 900000),
  },
  {
    id: "insight-2",
    type: "trend",
    title: "BTC Bullish Momentum",
    summary:
      "Technical indicators suggest continued upward momentum for BTC/USD over the next 24-48 hours. RSI at 62, MACD showing bullish crossover.",
    confidence: 0.78,
    relatedAssets: ["BTC/USD"],
    timestamp: new Date(Date.now() - 1800000),
  },
  {
    id: "insight-3",
    type: "volatility",
    title: "Equity Market Correlation",
    summary:
      "Crypto assets showing increased correlation with NASDAQ futures. Consider adjusting hedging strategies.",
    confidence: 0.85,
    relatedAssets: ["BTC/USD", "ETH/USD", "NVDA"],
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: "insight-4",
    type: "prediction",
    title: "ETH Support Level",
    summary:
      "Strong support identified at $3,450 for ETH/USD. Probability of breakdown below this level is estimated at 15%.",
    confidence: 0.71,
    relatedAssets: ["ETH/USD"],
    timestamp: new Date(Date.now() - 5400000),
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "Alert Triggered",
    message: "BTC crossed $67,000 threshold",
    type: "alert",
    read: false,
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: "notif-2",
    title: "New AI Insight",
    message: "Unusual trading volume detected in SOL/USD",
    type: "insight",
    read: false,
    timestamp: new Date(Date.now() - 900000),
  },
  {
    id: "notif-3",
    title: "System Update",
    message: "Scheduled maintenance completed successfully",
    type: "system",
    read: true,
    timestamp: new Date(Date.now() - 7200000),
  },
];

// Helper to simulate real-time price updates
export const simulatePriceUpdate = (asset: MarketAsset): MarketAsset => {
  const volatility = 0.0005;
  const priceChange = asset.price * (Math.random() - 0.5) * volatility;
  const newPrice = asset.price + priceChange;
  const newChange = ((newPrice - asset.sparkline[0]) / asset.sparkline[0]) * 100;

  return {
    ...asset,
    price: newPrice,
    change24h: newChange,
    sparkline: [...asset.sparkline.slice(1), newPrice],
    lastUpdate: new Date(),
  };
};

// Helper to simulate metric updates
export const simulateMetricUpdate = (metrics: SystemMetrics): SystemMetrics => {
  return {
    queueDepth: Math.max(0, metrics.queueDepth + Math.floor((Math.random() - 0.5) * 200)),
    ticksPerSec: Math.max(0, metrics.ticksPerSec + Math.floor((Math.random() - 0.5) * 500)),
    redisOpsPerSec: Math.max(0, metrics.redisOpsPerSec + Math.floor((Math.random() - 0.5) * 300)),
    dbLatencyMs: Math.max(0.5, metrics.dbLatencyMs + (Math.random() - 0.5) * 0.3),
    cpuUsage: Math.min(100, Math.max(0, metrics.cpuUsage + (Math.random() - 0.5) * 3)),
    memoryUsage: Math.min(100, Math.max(0, metrics.memoryUsage + (Math.random() - 0.5) * 2)),
    networkIn: Math.max(0, metrics.networkIn + (Math.random() - 0.5) * 10),
    networkOut: Math.max(0, metrics.networkOut + (Math.random() - 0.5) * 8),
  };
};
