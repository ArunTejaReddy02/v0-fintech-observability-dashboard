"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface PriceChartProps {
  symbol: string;
  data?: CandlestickData[];
}

const timeframes = ["1H", "4H", "1D", "1W", "1M"];

// Generate mock candlestick data
function generateCandlestickData(
  basePrice: number,
  count: number = 50
): CandlestickData[] {
  const data: CandlestickData[] = [];
  let price = basePrice * 0.95;
  const now = Date.now();
  const interval = 3600000; // 1 hour

  for (let i = 0; i < count; i++) {
    const open = price;
    const change = (Math.random() - 0.48) * basePrice * 0.02;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * basePrice * 0.01;
    const low = Math.min(open, close) - Math.random() * basePrice * 0.01;
    const volume = Math.random() * 1000000000;

    data.push({
      time: now - (count - i) * interval,
      open,
      high,
      low,
      close,
      volume,
    });

    price = close;
  }

  return data;
}

export function PriceChart({ symbol, data: propData }: PriceChartProps) {
  const [timeframe, setTimeframe] = useState("1D");
  const [chartData, setChartData] = useState<CandlestickData[]>([]);

  // Generate initial data
  useEffect(() => {
    const basePrice = symbol.includes("BTC")
      ? 67000
      : symbol.includes("ETH")
      ? 3500
      : symbol.includes("SOL")
      ? 175
      : 200;
    setChartData(propData || generateCandlestickData(basePrice));
  }, [symbol, propData]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => {
        if (prev.length === 0) return prev;
        const lastCandle = prev[prev.length - 1];
        const change = (Math.random() - 0.5) * lastCandle.close * 0.001;
        const newClose = lastCandle.close + change;

        return prev.map((candle, idx) =>
          idx === prev.length - 1
            ? {
                ...candle,
                close: newClose,
                high: Math.max(candle.high, newClose),
                low: Math.min(candle.low, newClose),
              }
            : candle
        );
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => {
    if (chartData.length === 0) return null;
    const latest = chartData[chartData.length - 1];
    const first = chartData[0];
    const change = ((latest.close - first.open) / first.open) * 100;
    const high = Math.max(...chartData.map((d) => d.high));
    const low = Math.min(...chartData.map((d) => d.low));

    return { latest, change, high, low };
  }, [chartData]);

  if (!stats) return null;

  return (
    <Card className="col-span-2 border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-4">
          <CardTitle className="text-lg font-semibold">{symbol}</CardTitle>
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xl font-bold text-foreground">
              ${stats.latest.close.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span
              className={cn(
                "rounded px-2 py-0.5 text-xs font-medium",
                stats.change >= 0
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive"
              )}
            >
              {stats.change >= 0 ? "+" : ""}
              {stats.change.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-border">
            {timeframes.map((tf) => (
              <Button
                key={tf}
                variant="ghost"
                size="sm"
                onClick={() => setTimeframe(tf)}
                className={cn(
                  "h-7 rounded-none px-3 text-xs",
                  timeframe === tf
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground"
                )}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        {/* Price Range */}
        <div className="mb-4 flex gap-6 text-xs">
          <div>
            <span className="text-muted-foreground">High: </span>
            <span className="font-mono text-foreground">
              ${stats.high.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Low: </span>
            <span className="font-mono text-foreground">
              ${stats.low.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Candlestick Chart */}
        <CandlestickChart data={chartData} />
      </CardContent>
    </Card>
  );
}

interface CandlestickChartProps {
  data: CandlestickData[];
}

function CandlestickChart({ data }: CandlestickChartProps) {
  const { candles, yLabels, chartMin, chartMax } = useMemo(() => {
    if (data.length === 0) return { candles: [], yLabels: [], chartMin: 0, chartMax: 0 };

    const allPrices = data.flatMap((d) => [d.high, d.low]);
    const min = Math.min(...allPrices);
    const max = Math.max(...allPrices);
    const padding = (max - min) * 0.1;
    const chartMin = min - padding;
    const chartMax = max + padding;
    const range = chartMax - chartMin;

    const candles = data.map((d, i) => {
      const x = (i / data.length) * 100;
      const width = 100 / data.length;
      const isGreen = d.close >= d.open;

      const highY = ((chartMax - d.high) / range) * 100;
      const lowY = ((chartMax - d.low) / range) * 100;
      const openY = ((chartMax - d.open) / range) * 100;
      const closeY = ((chartMax - d.close) / range) * 100;

      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.abs(closeY - openY) || 1;

      return {
        x,
        width,
        highY,
        lowY,
        bodyTop,
        bodyHeight,
        isGreen,
      };
    });

    // Generate Y-axis labels
    const labelCount = 5;
    const yLabels = Array.from({ length: labelCount }, (_, i) => {
      const value = chartMax - (range * i) / (labelCount - 1);
      return {
        value,
        y: (i / (labelCount - 1)) * 100,
      };
    });

    return { candles, yLabels, chartMin, chartMax };
  }, [data]);

  return (
    <div className="relative h-64">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 flex h-full w-16 flex-col justify-between text-right text-xs text-muted-foreground">
        {yLabels.map((label, i) => (
          <span key={i} className="font-mono">
            ${label.value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
        ))}
      </div>

      {/* Chart */}
      <div className="ml-16 h-full">
        <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="none">
          {/* Grid lines */}
          {yLabels.map((label, i) => (
            <line
              key={i}
              x1="0"
              y1={label.y}
              x2="100"
              y2={label.y}
              stroke="#2a3142"
              strokeWidth="0.2"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* Candles */}
          {candles.map((candle, i) => (
            <g key={i}>
              {/* Wick */}
              <line
                x1={candle.x + candle.width / 2}
                y1={candle.highY}
                x2={candle.x + candle.width / 2}
                y2={candle.lowY}
                stroke={candle.isGreen ? "#10b981" : "#ef4444"}
                strokeWidth="0.3"
                vectorEffect="non-scaling-stroke"
              />
              {/* Body */}
              <rect
                x={candle.x + candle.width * 0.15}
                y={candle.bodyTop}
                width={candle.width * 0.7}
                height={candle.bodyHeight}
                fill={candle.isGreen ? "#10b981" : "#ef4444"}
                rx="0.3"
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
