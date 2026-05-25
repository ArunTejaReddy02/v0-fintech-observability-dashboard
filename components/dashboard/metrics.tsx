"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Activity,
  Database,
  Cpu,
  HardDrive,
  Layers,
  Zap,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type { SystemMetrics } from "@/lib/types";

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "success" | "warning" | "danger";
}

export function MetricCard({
  title,
  value,
  unit,
  icon,
  trend = "neutral",
  trendValue,
  variant = "default",
}: MetricCardProps) {
  const formattedValue = useMemo(() => {
    if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1) + "M";
    }
    if (value >= 1_000) {
      return (value / 1_000).toFixed(1) + "K";
    }
    if (Number.isInteger(value)) {
      return value.toLocaleString();
    }
    return value.toFixed(1);
  }, [value]);

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              variant === "success" && "bg-success/10 text-success",
              variant === "warning" && "bg-warning/10 text-warning",
              variant === "danger" && "bg-destructive/10 text-destructive",
              variant === "default" && "bg-primary/10 text-primary"
            )}
          >
            {icon}
          </div>

          {trend !== "neutral" && trendValue && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs",
                trend === "up" ? "text-success" : "text-destructive"
              )}
            >
              {trend === "up" ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {trendValue}
            </div>
          )}
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-bold text-foreground">
              {formattedValue}
            </span>
            <span className="text-sm text-muted-foreground">{unit}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface MetricsGridProps {
  metrics: SystemMetrics;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <MetricCard
        title="Queue Depth"
        value={metrics.queueDepth}
        unit="msgs"
        icon={<Layers className="h-4 w-4" />}
        variant={metrics.queueDepth > 10000 ? "warning" : "default"}
      />
      <MetricCard
        title="Throughput"
        value={metrics.ticksPerSec}
        unit="ticks/s"
        icon={<Zap className="h-4 w-4" />}
        variant="success"
        trend="up"
        trendValue="+12%"
      />
      <MetricCard
        title="Redis Ops"
        value={metrics.redisOpsPerSec}
        unit="ops/s"
        icon={<Database className="h-4 w-4" />}
      />
      <MetricCard
        title="DB Latency"
        value={metrics.dbLatencyMs}
        unit="ms"
        icon={<Activity className="h-4 w-4" />}
        variant={metrics.dbLatencyMs > 5 ? "warning" : "success"}
      />
    </div>
  );
}

interface ResourceGaugeProps {
  label: string;
  value: number;
  max?: number;
  icon: React.ReactNode;
}

export function ResourceGauge({ label, value, max = 100, icon }: ResourceGaugeProps) {
  const percentage = (value / max) * 100;
  const variant =
    percentage >= 90 ? "danger" : percentage >= 70 ? "warning" : "success";

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md",
          variant === "success" && "bg-success/10 text-success",
          variant === "warning" && "bg-warning/10 text-warning",
          variant === "danger" && "bg-destructive/10 text-destructive"
        )}
      >
        {icon}
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-mono text-foreground">{value.toFixed(0)}%</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              variant === "success" && "bg-success",
              variant === "warning" && "bg-warning",
              variant === "danger" && "bg-destructive"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

interface SystemResourcesProps {
  metrics: SystemMetrics;
}

export function SystemResources({ metrics }: SystemResourcesProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">System Resources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ResourceGauge
          label="CPU Usage"
          value={metrics.cpuUsage}
          icon={<Cpu className="h-4 w-4" />}
        />
        <ResourceGauge
          label="Memory Usage"
          value={metrics.memoryUsage}
          icon={<HardDrive className="h-4 w-4" />}
        />
        <div className="flex items-center justify-between border-t border-border pt-4 text-xs">
          <div className="flex items-center gap-2">
            <ArrowDown className="h-3 w-3 text-success" />
            <span className="text-muted-foreground">Network In:</span>
            <span className="font-mono text-foreground">
              {metrics.networkIn.toFixed(1)} MB/s
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowUp className="h-3 w-3 text-primary" />
            <span className="text-muted-foreground">Out:</span>
            <span className="font-mono text-foreground">
              {metrics.networkOut.toFixed(1)} MB/s
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
