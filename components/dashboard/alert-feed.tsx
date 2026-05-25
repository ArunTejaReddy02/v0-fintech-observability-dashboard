"use client";

import { useMemo } from "react";
import type { Alert, AlertSeverity, AlertStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Check,
  Clock,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AlertFeedProps {
  alerts: Alert[];
  onResolve?: (id: string) => void;
  onSnooze?: (id: string) => void;
}

const severityConfig: Record<
  AlertSeverity,
  { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  critical: {
    icon: AlertCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  info: {
    icon: Info,
    color: "text-primary",
    bg: "bg-primary/10",
  },
};

const statusConfig: Record<AlertStatus, { label: string; variant: string }> = {
  active: { label: "Active", variant: "bg-primary/10 text-primary" },
  triggered: { label: "Triggered", variant: "bg-warning/10 text-warning" },
  resolved: { label: "Resolved", variant: "bg-success/10 text-success" },
  snoozed: { label: "Snoozed", variant: "bg-muted text-muted-foreground" },
};

export function AlertFeed({ alerts, onResolve, onSnooze }: AlertFeedProps) {
  const activeCount = alerts.filter(
    (a) => a.status === "active" || a.status === "triggered"
  ).length;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium">Alert Feed</CardTitle>
          {activeCount > 0 && (
            <Badge variant="secondary" className="bg-destructive/10 text-destructive">
              {activeCount} active
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5">
          <Filter className="h-3.5 w-3.5" />
          Filter
        </Button>
      </CardHeader>
      <CardContent className="max-h-96 space-y-2 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Check className="h-8 w-8 text-success" />
            <p className="mt-2 text-sm text-muted-foreground">
              No active alerts
            </p>
          </div>
        ) : (
          alerts.map((alert) => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onResolve={onResolve}
              onSnooze={onSnooze}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}

interface AlertItemProps {
  alert: Alert;
  onResolve?: (id: string) => void;
  onSnooze?: (id: string) => void;
}

function AlertItem({ alert, onResolve, onSnooze }: AlertItemProps) {
  const severity = severityConfig[alert.severity];
  const status = statusConfig[alert.status];
  const Icon = severity.icon;

  const timeAgo = useMemo(() => {
    const date = alert.triggeredAt || alert.createdAt;
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }, [alert.triggeredAt, alert.createdAt]);

  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50",
        alert.status === "resolved" && "opacity-60"
      )}
    >
      <div className={cn("flex h-8 w-8 items-center justify-center rounded-md", severity.bg)}>
        <Icon className={cn("h-4 w-4", severity.color)} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground truncate">
            {alert.title}
          </span>
          <Badge
            variant="secondary"
            className={cn("shrink-0 text-[10px]", status.variant)}
          >
            {status.label}
          </Badge>
        </div>

        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
          {alert.description}
        </p>

        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          {alert.asset && (
            <span className="font-mono bg-muted px-1.5 py-0.5 rounded">
              {alert.asset}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeAgo}
          </span>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {alert.status !== "resolved" && (
            <>
              <DropdownMenuItem onClick={() => onResolve?.(alert.id)}>
                <Check className="mr-2 h-4 w-4" />
                Resolve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSnooze?.(alert.id)}>
                <Clock className="mr-2 h-4 w-4" />
                Snooze
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem>View Details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
