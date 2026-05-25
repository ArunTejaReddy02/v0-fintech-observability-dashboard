"use client";

import { useMemo } from "react";
import type { Worker, WorkerStatus, WorkerType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Server,
  Cpu,
  HardDrive,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
  ArrowRight,
} from "lucide-react";

interface WorkerMonitoringProps {
  workers: Worker[];
}

const statusConfig: Record<
  WorkerStatus,
  { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  healthy: {
    icon: CheckCircle,
    color: "text-success",
    bg: "bg-success/10",
  },
  degraded: {
    icon: AlertCircle,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  down: {
    icon: AlertCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  starting: {
    icon: Loader2,
    color: "text-primary",
    bg: "bg-primary/10",
  },
};

const typeLabels: Record<WorkerType, string> = {
  ingestion: "Ingestion",
  processor: "Processor",
  evaluator: "Evaluator",
  writer: "Writer",
  "ai-agent": "AI Agent",
};

export function WorkerMonitoring({ workers }: WorkerMonitoringProps) {
  const stats = useMemo(() => {
    const healthy = workers.filter((w) => w.status === "healthy").length;
    const degraded = workers.filter((w) => w.status === "degraded").length;
    const down = workers.filter((w) => w.status === "down").length;
    const totalProcessed = workers.reduce((sum, w) => sum + w.processedCount, 0);

    return { healthy, degraded, down, totalProcessed };
  }, [workers]);

  const groupedWorkers = useMemo(() => {
    const groups: Record<WorkerType, Worker[]> = {
      ingestion: [],
      processor: [],
      evaluator: [],
      writer: [],
      "ai-agent": [],
    };

    workers.forEach((worker) => {
      groups[worker.type].push(worker);
    });

    return groups;
  }, [workers]);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.healthy}</p>
                <p className="text-xs text-muted-foreground">Healthy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-warning/10 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.degraded}</p>
                <p className="text-xs text-muted-foreground">Degraded</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.down}</p>
                <p className="text-xs text-muted-foreground">Down</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {(stats.totalProcessed / 1_000_000).toFixed(1)}M
                </p>
                <p className="text-xs text-muted-foreground">Processed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Visualization */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Data Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-2">
            {(Object.keys(groupedWorkers) as WorkerType[]).map((type, index) => (
              <div key={type} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-16 w-24 flex-col items-center justify-center rounded-lg border transition-colors",
                      groupedWorkers[type].every((w) => w.status === "healthy")
                        ? "border-success/30 bg-success/5"
                        : groupedWorkers[type].some((w) => w.status === "down")
                        ? "border-destructive/30 bg-destructive/5"
                        : "border-warning/30 bg-warning/5"
                    )}
                  >
                    <Server className="h-5 w-5 text-muted-foreground" />
                    <span className="mt-1 text-xs font-medium text-foreground">
                      {typeLabels[type]}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {groupedWorkers[type].length} workers
                    </span>
                  </div>
                </div>
                {index < Object.keys(groupedWorkers).length - 1 && (
                  <ArrowRight className="mx-2 h-4 w-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Worker Details */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workers.map((worker) => (
          <WorkerCard key={worker.id} worker={worker} />
        ))}
      </div>
    </div>
  );
}

interface WorkerCardProps {
  worker: Worker;
}

function WorkerCard({ worker }: WorkerCardProps) {
  const status = statusConfig[worker.status];
  const StatusIcon = status.icon;

  const uptime = useMemo(() => {
    const days = Math.floor(worker.uptime / 86400);
    const hours = Math.floor((worker.uptime % 86400) / 3600);
    return `${days}d ${hours}h`;
  }, [worker.uptime]);

  const processedFormatted = useMemo(() => {
    if (worker.processedCount >= 1_000_000) {
      return (worker.processedCount / 1_000_000).toFixed(1) + "M";
    }
    if (worker.processedCount >= 1_000) {
      return (worker.processedCount / 1_000).toFixed(1) + "K";
    }
    return worker.processedCount.toString();
  }, [worker.processedCount]);

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-md", status.bg)}>
              <StatusIcon
                className={cn(
                  "h-4 w-4",
                  status.color,
                  worker.status === "starting" && "animate-spin"
                )}
              />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">{worker.name}</p>
              <p className="text-xs text-muted-foreground">{typeLabels[worker.type]}</p>
            </div>
          </div>

          <Badge
            variant="secondary"
            className={cn(
              "text-[10px]",
              worker.status === "healthy" && "bg-success/10 text-success",
              worker.status === "degraded" && "bg-warning/10 text-warning",
              worker.status === "down" && "bg-destructive/10 text-destructive",
              worker.status === "starting" && "bg-primary/10 text-primary"
            )}
          >
            {worker.status}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">CPU</span>
                <span className="font-mono text-foreground">{worker.cpu}%</span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full",
                    worker.cpu >= 90
                      ? "bg-destructive"
                      : worker.cpu >= 70
                      ? "bg-warning"
                      : "bg-success"
                  )}
                  style={{ width: `${worker.cpu}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <HardDrive className="h-3.5 w-3.5 text-muted-foreground" />
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Memory</span>
                <span className="font-mono text-foreground">{worker.memory}%</span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full",
                    worker.memory >= 90
                      ? "bg-destructive"
                      : worker.memory >= 70
                      ? "bg-warning"
                      : "bg-success"
                  )}
                  style={{ width: `${worker.memory}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Uptime: {uptime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            <span>{processedFormatted} processed</span>
          </div>
        </div>

        {worker.errorRate > 0.01 && (
          <div className="mt-2 flex items-center gap-1 text-xs text-warning">
            <AlertCircle className="h-3 w-3" />
            <span>Error rate: {(worker.errorRate * 100).toFixed(2)}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
