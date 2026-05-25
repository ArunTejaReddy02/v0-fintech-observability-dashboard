"use client";

import { useMemo } from "react";
import type { AIInsight, InsightType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Activity,
  Target,
  Calendar,
} from "lucide-react";

interface AIInsightsPanelProps {
  insights: AIInsight[];
}

const insightTypeConfig: Record<
  InsightType,
  { icon: React.ComponentType<{ className?: string }>; color: string; label: string }
> = {
  anomaly: {
    icon: AlertTriangle,
    color: "text-warning",
    label: "Anomaly",
  },
  volatility: {
    icon: Activity,
    color: "text-destructive",
    label: "Volatility",
  },
  trend: {
    icon: TrendingUp,
    color: "text-success",
    label: "Trend",
  },
  prediction: {
    icon: Target,
    color: "text-primary",
    label: "Prediction",
  },
  event: {
    icon: Calendar,
    color: "text-chart-4",
    label: "Event",
  },
};

export function AIInsightsPanel({ insights }: AIInsightsPanelProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Sparkles className="h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              No insights available
            </p>
          </div>
        ) : (
          insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))
        )}
      </CardContent>
    </Card>
  );
}

interface InsightCardProps {
  insight: AIInsight;
}

function InsightCard({ insight }: InsightCardProps) {
  const config = insightTypeConfig[insight.type];
  const Icon = config.icon;

  const timeAgo = useMemo(() => {
    const now = new Date();
    const seconds = Math.floor(
      (now.getTime() - insight.timestamp.getTime()) / 1000
    );

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }, [insight.timestamp]);

  const confidenceLevel =
    insight.confidence >= 0.85
      ? "High"
      : insight.confidence >= 0.65
      ? "Medium"
      : "Low";

  return (
    <div className="rounded-lg border border-border p-3 transition-colors hover:bg-muted/30">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
            insight.type === "anomaly" && "bg-warning/10",
            insight.type === "volatility" && "bg-destructive/10",
            insight.type === "trend" && "bg-success/10",
            insight.type === "prediction" && "bg-primary/10",
            insight.type === "event" && "bg-chart-4/10"
          )}
        >
          <Icon className={cn("h-4 w-4", config.color)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground text-sm truncate">
              {insight.title}
            </span>
          </div>

          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            {insight.summary}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="text-[10px] bg-muted text-muted-foreground"
            >
              {config.label}
            </Badge>

            <span
              className={cn(
                "text-[10px] font-medium px-1.5 py-0.5 rounded",
                confidenceLevel === "High" && "bg-success/10 text-success",
                confidenceLevel === "Medium" && "bg-warning/10 text-warning",
                confidenceLevel === "Low" && "bg-muted text-muted-foreground"
              )}
            >
              {(insight.confidence * 100).toFixed(0)}% confidence
            </span>

            <span className="text-[10px] text-muted-foreground">{timeAgo}</span>
          </div>

          {insight.relatedAssets.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {insight.relatedAssets.map((asset) => (
                <span
                  key={asset}
                  className="font-mono text-[10px] bg-secondary px-1.5 py-0.5 rounded"
                >
                  {asset}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
