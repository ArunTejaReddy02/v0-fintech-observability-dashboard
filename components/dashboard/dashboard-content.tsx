"use client";

import { useDashboardStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { MarketCard } from "./market-card";
import { PriceChart } from "./price-chart";
import { MetricsGrid, SystemResources } from "./metrics";
import { AlertFeed } from "./alert-feed";
import { AIInsightsPanel } from "./ai-insights";
import { WorkerMonitoring } from "./worker-monitoring";

export function DashboardContent() {
  const { activeView, assets, alerts, workers, metrics, insights, updateAlert } =
    useDashboardStore();

  const handleResolveAlert = (id: string) => {
    updateAlert(id, { status: "resolved", resolvedAt: new Date() });
  };

  const handleSnoozeAlert = (id: string) => {
    updateAlert(id, { status: "snoozed" });
  };

  // Render based on active view
  if (activeView === "workers") {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Worker Monitoring</h1>
          <p className="text-sm text-muted-foreground">
            Monitor and manage your data pipeline workers
          </p>
        </div>
        <WorkerMonitoring workers={workers} />
      </div>
    );
  }

  if (activeView === "alerts") {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Alert Engine</h1>
          <p className="text-sm text-muted-foreground">
            Configure and manage your alert rules and notifications
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <AlertFeed
            alerts={alerts}
            onResolve={handleResolveAlert}
            onSnooze={handleSnoozeAlert}
          />
          <AIInsightsPanel insights={insights} />
        </div>
      </div>
    );
  }

  if (activeView === "insights") {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">AI Insights</h1>
          <p className="text-sm text-muted-foreground">
            AI-powered market analysis and predictions
          </p>
        </div>
        <div className="max-w-3xl">
          <AIInsightsPanel insights={insights} />
        </div>
      </div>
    );
  }

  if (activeView === "markets") {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Live Markets</h1>
          <p className="text-sm text-muted-foreground">
            Real-time market data and price feeds
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assets.map((asset) => (
            <MarketCard key={asset.id} asset={asset} />
          ))}
        </div>
      </div>
    );
  }

  // Default: Dashboard Overview
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Real-time market intelligence and system observability
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="mb-6">
        <MetricsGrid metrics={metrics} />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Chart and Markets */}
        <div className="space-y-6 lg:col-span-2">
          {/* Price Chart */}
          <PriceChart symbol={assets[0]?.symbol || "BTC/USD"} />

          {/* Market Cards */}
          <div>
            <h2 className="mb-4 text-sm font-medium text-muted-foreground">
              Watchlist
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {assets.slice(0, 6).map((asset) => (
                <MarketCard key={asset.id} asset={asset} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Alerts, Insights, Resources */}
        <div className="space-y-6">
          <SystemResources metrics={metrics} />

          <AlertFeed
            alerts={alerts.slice(0, 4)}
            onResolve={handleResolveAlert}
            onSnooze={handleSnoozeAlert}
          />

          <AIInsightsPanel insights={insights.slice(0, 3)} />
        </div>
      </div>
    </div>
  );
}
