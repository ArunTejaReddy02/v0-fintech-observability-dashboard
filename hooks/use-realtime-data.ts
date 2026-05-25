"use client";

import { useEffect, useRef, useCallback } from "react";
import { useDashboardStore } from "@/lib/store";
import {
  mockAssets,
  mockAlerts,
  mockWorkers,
  mockMetrics,
  mockInsights,
  mockNotifications,
  simulatePriceUpdate,
  simulateMetricUpdate,
} from "@/lib/mock-data";

export function useRealtimeData() {
  const {
    setAssets,
    setAlerts,
    setWorkers,
    setMetrics,
    setInsights,
    assets,
    metrics,
    updateAsset,
  } = useDashboardStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const metricsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize data on mount
  useEffect(() => {
    setAssets(mockAssets);
    setAlerts(mockAlerts);
    setWorkers(mockWorkers);
    setMetrics(mockMetrics);
    setInsights(mockInsights);

    // Add initial notifications
    mockNotifications.forEach((notif) => {
      useDashboardStore.getState().addNotification(notif);
    });
  }, [setAssets, setAlerts, setWorkers, setMetrics, setInsights]);

  // Simulate real-time price updates
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const currentAssets = useDashboardStore.getState().assets;
      if (currentAssets.length > 0) {
        // Update a random asset
        const randomIndex = Math.floor(Math.random() * currentAssets.length);
        const asset = currentAssets[randomIndex];
        const updatedAsset = simulatePriceUpdate(asset);
        updateAsset(asset.id, updatedAsset);
      }
    }, 100); // Update every 100ms for smooth real-time feel

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateAsset]);

  // Simulate metrics updates
  useEffect(() => {
    metricsIntervalRef.current = setInterval(() => {
      const currentMetrics = useDashboardStore.getState().metrics;
      const updatedMetrics = simulateMetricUpdate(currentMetrics);
      setMetrics(updatedMetrics);
    }, 1000); // Update every second

    return () => {
      if (metricsIntervalRef.current) {
        clearInterval(metricsIntervalRef.current);
      }
    };
  }, [setMetrics]);

  return { assets, metrics };
}

export function useAnimatedNumber(
  value: number,
  duration: number = 300
): number {
  const ref = useRef(value);
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const startValueRef = useRef(value);

  useEffect(() => {
    startValueRef.current = ref.current;
    startTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) return;

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      ref.current =
        startValueRef.current + (value - startValueRef.current) * eased;

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        ref.current = value;
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value, duration]);

  return ref.current;
}

export function useFormattedNumber(value: number, decimals: number = 2): string {
  return useCallback(() => {
    if (value >= 1_000_000_000_000) {
      return `${(value / 1_000_000_000_000).toFixed(decimals)}T`;
    }
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(decimals)}B`;
    }
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(decimals)}M`;
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(decimals)}K`;
    }
    return value.toFixed(decimals);
  }, [value, decimals])();
}

export function useTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
