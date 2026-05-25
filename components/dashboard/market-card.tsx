"use client";

import { useMemo } from "react";
import type { MarketAsset } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MarketCardProps {
  asset: MarketAsset;
  onClick?: () => void;
}

export function MarketCard({ asset, onClick }: MarketCardProps) {
  const isPositive = asset.change24h > 0;
  const isNeutral = asset.change24h === 0;

  const formattedPrice = useMemo(() => {
    if (asset.price >= 1000) {
      return asset.price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return asset.price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  }, [asset.price]);

  const formattedVolume = useMemo(() => {
    if (asset.volume24h >= 1_000_000_000) {
      return `$${(asset.volume24h / 1_000_000_000).toFixed(1)}B`;
    }
    if (asset.volume24h >= 1_000_000) {
      return `$${(asset.volume24h / 1_000_000).toFixed(1)}M`;
    }
    return `$${(asset.volume24h / 1_000).toFixed(1)}K`;
  }, [asset.volume24h]);

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:bg-card/80",
        "border-border bg-card"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          {/* Asset Info */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">
                {asset.symbol}
              </span>
              <span
                className={cn(
                  "flex h-5 items-center rounded px-1.5 text-xs font-medium",
                  asset.status === "active"
                    ? "bg-success/10 text-success"
                    : asset.status === "halted"
                    ? "bg-warning/10 text-warning"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {asset.status}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{asset.name}</span>
          </div>

          {/* Change Indicator */}
          <div
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-1",
              isPositive
                ? "bg-success/10 text-success"
                : isNeutral
                ? "bg-muted text-muted-foreground"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : isNeutral ? (
              <Minus className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span className="text-xs font-medium">
              {isPositive ? "+" : ""}
              {asset.change24h.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="mt-3">
          <span className="font-mono text-2xl font-semibold text-foreground">
            ${formattedPrice}
          </span>
        </div>

        {/* Sparkline */}
        <div className="mt-3">
          <Sparkline data={asset.sparkline} positive={isPositive} />
        </div>

        {/* Volume */}
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>24h Volume</span>
          <span className="font-mono">{formattedVolume}</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface SparklineProps {
  data: number[];
  positive: boolean;
}

function Sparkline({ data, positive }: SparklineProps) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  const fillPoints = `0,100 ${points} 100,100`;

  return (
    <svg
      viewBox="0 0 100 40"
      className="h-10 w-full"
      preserveAspectRatio="none"
    >
      {/* Gradient fill */}
      <defs>
        <linearGradient id={`gradient-${positive}`} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor={positive ? "#10b981" : "#ef4444"}
            stopOpacity="0.2"
          />
          <stop
            offset="100%"
            stopColor={positive ? "#10b981" : "#ef4444"}
            stopOpacity="0"
          />
        </linearGradient>
      </defs>

      {/* Fill */}
      <polygon
        points={fillPoints}
        fill={`url(#gradient-${positive})`}
      />

      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "#10b981" : "#ef4444"}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
