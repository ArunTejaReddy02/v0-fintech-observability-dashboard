import "dotenv/config";

import { prisma } from "../lib/db/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  // 1. Clean existing data
  await prisma.alert.deleteMany({});
  await prisma.worker.deleteMany({});
  await prisma.asset.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.organization.deleteMany({});

  // 2. Create organization
  const org = await prisma.organization.create({
    data: {
      id: "org-1",
      name: "PulseStream Corp",
    },
  });

  // 3. Create user
  const passwordHash = bcrypt.hashSync("password123", 10);
  await prisma.user.create({
    data: {
      id: "user-1",
      email: "john@pulsestream.io",
      name: "John Doe",
      passwordHash,
      role: "admin",
      organizationId: org.id,
    },
  });

  // 4. Create assets
  const sparklineBtc = [64000, 64200, 64100, 64500, 64800, 65000, 64900, 65200, 65500, 65800, 66000, 66200, 66500, 66300, 66700, 67000, 67200, 67100, 67500, 67800, 67432.5];
  const sparklineEth = [3400, 3420, 3410, 3450, 3480, 3500, 3490, 3520, 3550, 3580, 3600, 3620, 3650, 3630, 3670, 3700, 3720, 3710, 3750, 3780, 3521.8];
  const sparklineSol = [150, 152, 151, 155, 158, 160, 159, 162, 165, 168, 170, 172, 175, 173, 177, 180, 182, 181, 185, 188, 178.42];
  const sparklineAapl = [180, 181, 180.5, 182, 183, 184, 183.5, 185, 186, 187, 188, 189, 190, 189.5, 191, 192, 191.5, 192, 193, 192.5, 189.84];
  const sparklineTsla = [240, 241, 240.5, 242, 243, 244, 243.5, 245, 246, 247, 248, 249, 250, 249.5, 251, 252, 251.5, 252, 253, 252.5, 248.5];
  const sparklineNvda = [820, 825, 830, 835, 840, 845, 850, 855, 860, 865, 870, 875, 880, 875.32];

  await prisma.asset.createMany({
    data: [
      {
        id: "btc-usd",
        symbol: "BTC/USD",
        name: "Bitcoin",
        price: 67432.5,
        change24h: 2.34,
        volume24h: 28500000000,
        high24h: 68120.0,
        low24h: 65890.0,
        marketCap: 1325000000000,
        sparkline: JSON.stringify(sparklineBtc),
        status: "active",
        organizationId: org.id,
      },
      {
        id: "eth-usd",
        symbol: "ETH/USD",
        name: "Ethereum",
        price: 3521.8,
        change24h: -1.12,
        volume24h: 15200000000,
        high24h: 3580.0,
        low24h: 3480.0,
        marketCap: 423000000000,
        sparkline: JSON.stringify(sparklineEth),
        status: "active",
        organizationId: org.id,
      },
      {
        id: "sol-usd",
        symbol: "SOL/USD",
        name: "Solana",
        price: 178.42,
        change24h: 5.67,
        volume24h: 3800000000,
        high24h: 182.0,
        low24h: 168.5,
        marketCap: 78000000000,
        sparkline: JSON.stringify(sparklineSol),
        status: "active",
        organizationId: org.id,
      },
      {
        id: "aapl",
        symbol: "AAPL",
        name: "Apple Inc.",
        price: 189.84,
        change24h: 0.45,
        volume24h: 5200000,
        high24h: 191.2,
        low24h: 188.5,
        marketCap: 2950000000000,
        sparkline: JSON.stringify(sparklineAapl),
        status: "active",
        organizationId: org.id,
      },
      {
        id: "tsla",
        symbol: "TSLA",
        name: "Tesla Inc.",
        price: 248.5,
        change24h: -2.18,
        volume24h: 98000000,
        high24h: 255.0,
        low24h: 245.2,
        marketCap: 790000000000,
        sparkline: JSON.stringify(sparklineTsla),
        status: "active",
        organizationId: org.id,
      },
      {
        id: "nvda",
        symbol: "NVDA",
        name: "NVIDIA Corp.",
        price: 875.32,
        change24h: 3.21,
        volume24h: 42000000,
        high24h: 885.0,
        low24h: 850.0,
        marketCap: 2150000000000,
        sparkline: JSON.stringify(sparklineNvda),
        status: "active",
        organizationId: org.id,
      },
    ],
  });

  // 5. Create workers
  await prisma.worker.createMany({
    data: [
      {
        id: "worker-1",
        name: "Market Ingestion Primary",
        type: "ingestion",
        status: "healthy",
        cpu: 45,
        memory: 62,
        uptime: 432000,
        processedCount: 15420000,
        errorRate: 0.001,
        organizationId: org.id,
      },
      {
        id: "worker-2",
        name: "Market Ingestion Secondary",
        type: "ingestion",
        status: "healthy",
        cpu: 38,
        memory: 55,
        uptime: 432000,
        processedCount: 14890000,
        errorRate: 0.002,
        organizationId: org.id,
      },
      {
        id: "worker-3",
        name: "Stream Processor Alpha",
        type: "processor",
        status: "healthy",
        cpu: 72,
        memory: 78,
        uptime: 345600,
        processedCount: 28500000,
        errorRate: 0.0005,
        organizationId: org.id,
      },
      {
        id: "worker-4",
        name: "Stream Processor Beta",
        type: "processor",
        status: "degraded",
        cpu: 89,
        memory: 85,
        uptime: 345600,
        processedCount: 26200000,
        errorRate: 0.015,
        organizationId: org.id,
      },
      {
        id: "worker-5",
        name: "Alert Evaluator",
        type: "evaluator",
        status: "healthy",
        cpu: 25,
        memory: 42,
        uptime: 518400,
        processedCount: 8900000,
        errorRate: 0.001,
        organizationId: org.id,
      },
      {
        id: "worker-6",
        name: "Database Writer Pool",
        type: "writer",
        status: "healthy",
        cpu: 55,
        memory: 68,
        uptime: 259200,
        processedCount: 45000000,
        errorRate: 0.0001,
        organizationId: org.id,
      },
      {
        id: "worker-7",
        name: "AI Analysis Agent",
        type: "ai-agent",
        status: "healthy",
        cpu: 65,
        memory: 82,
        uptime: 172800,
        processedCount: 125000,
        errorRate: 0.005,
        organizationId: org.id,
      },
    ],
  });

  // 6. Create alerts
  await prisma.alert.createMany({
    data: [
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
        organizationId: org.id,
      },
      {
        id: "alert-2",
        title: "High Volatility Detected",
        description: "SOL/USD showing unusual volatility patterns",
        severity: "critical",
        status: "active",
        asset: "SOL/USD",
        createdAt: new Date(Date.now() - 600000),
        organizationId: org.id,
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
        organizationId: org.id,
      },
      {
        id: "alert-4",
        title: "Worker Health Degraded",
        description: "Ingestion worker experiencing high latency",
        severity: "info",
        status: "resolved",
        createdAt: new Date(Date.now() - 7200000),
        resolvedAt: new Date(Date.now() - 3600000),
        organizationId: org.id,
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
