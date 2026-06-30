import "dotenv/config";
import { prisma } from "../lib/db/prisma";

async function main() {
  console.log("Telemetry Simulator started. Running updates every 2 seconds...");

  while (true) {
    try {
      const assets = await prisma.asset.findMany();
      for (const asset of assets) {
        const volatility = asset.symbol.includes("USD") ? 0.0008 : 0.0003;
        const priceChange = asset.price * (Math.random() - 0.5) * volatility;
        const newPrice = asset.price + priceChange;
        
        let sparkline: number[] = [];
        try {
          sparkline = JSON.parse(asset.sparkline);
        } catch {
          sparkline = Array(20).fill(asset.price);
        }
        
        sparkline.push(newPrice);
        if (sparkline.length > 24) {
          sparkline.shift();
        }

        const firstPrice = sparkline[0] || newPrice;
        const newChange = ((newPrice - firstPrice) / firstPrice) * 100;

        await prisma.asset.update({
          where: { id: asset.id },
          data: {
            price: newPrice,
            change24h: newChange,
            sparkline: JSON.stringify(sparkline),
            lastUpdate: new Date(),
          },
        });
      }

      const workers = await prisma.worker.findMany();
      for (const worker of workers) {
        const cpuChange = (Math.random() - 0.5) * 6;
        const memChange = (Math.random() - 0.5) * 3;

        let newCpu = Math.min(95, Math.max(10, worker.cpu + cpuChange));
        const newMemory = Math.min(95, Math.max(20, worker.memory + memChange));
        
        if (worker.status === "degraded") {
          newCpu = Math.min(98, Math.max(80, worker.cpu + (Math.random() - 0.4) * 5));
        }

        const processedDelta = Math.floor(50 + Math.random() * 150);
        const errorRateChange = (Math.random() - 0.5) * 0.001;
        const newErrorRate = Math.min(0.1, Math.max(0, worker.errorRate + errorRateChange));

        await prisma.worker.update({
          where: { id: worker.id },
          data: {
            cpu: newCpu,
            memory: newMemory,
            uptime: worker.uptime + 2,
            processedCount: worker.processedCount + processedDelta,
            errorRate: newErrorRate,
            lastHeartbeat: new Date(),
          },
        });

        if (newCpu > 88 && Math.random() < 0.15) {
          const alertExists = await prisma.alert.findFirst({
            where: {
              title: `${worker.name} High CPU Alert`,
              status: "active",
            },
          });

          if (!alertExists) {
            await prisma.alert.create({
              data: {
                title: `${worker.name} High CPU Alert`,
                description: `Worker ${worker.name} is experiencing high CPU load of ${newCpu.toFixed(1)}%`,
                severity: "warning",
                status: "active",
                organizationId: worker.organizationId,
                createdAt: new Date(),
              },
            });
            console.log(`[ALERT] Created CPU alert for ${worker.name}`);
          }
        }
      }

      if (Math.random() < 0.05) {
        const anomalies = [
          { title: "Kafka Consumer Lag Spike", desc: "Partition 4 consumer group telemetry-processor lagging by 15,230 messages", severity: "warning" },
          { title: "Database Latency Anomaly", desc: "Neon Postgres pool database read latency spiked to 45ms", severity: "critical" },
          { title: "Ingestion Rate Drop", desc: "Overall metrics ingestion throughput dropped below 8,000 ticks/s", severity: "info" }
        ];
        const anomaly = anomalies[Math.floor(Math.random() * anomalies.length)];
        
        const alertExists = await prisma.alert.findFirst({
          where: {
            title: anomaly.title,
            status: "active",
          },
        });

        if (!alertExists) {
          await prisma.alert.create({
            data: {
              title: anomaly.title,
              description: anomaly.desc,
              severity: anomaly.severity,
              status: "active",
              organizationId: "org-1",
              createdAt: new Date(),
            },
          });
          console.log(`[ALERT] Created generic alert: ${anomaly.title}`);
        }
      }

      console.log(`[Simulator Tick] Updated ${assets.length} assets, ${workers.length} workers.`);
    } catch (error) {
      console.error("Error in simulator tick:", error);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

main().catch((e) => {
  console.error("Fatal error in simulator:", e);
  process.exit(1);
});
