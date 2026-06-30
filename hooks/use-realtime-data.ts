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
  } = useDashboardStore();

  useEffect(() => {
    // Populate static AI insights on mount
    setInsights(mockInsights);

    // Add initial notifications
    mockNotifications.forEach((notif) => {
      useDashboardStore.getState().addNotification(notif);
    });

    const fetchData = async () => {
      try {
        const [assetsRes, alertsRes, workersRes, metricsRes] = await Promise.all([
          fetch("/api/assets"),
          fetch("/api/alerts"),
          fetch("/api/workers"),
          fetch("/api/metrics"),
        ]);

        if (assetsRes.ok) {
          const assetsData = await assetsRes.json();
          // Map dates from string back to Date objects
          setAssets(assetsData.map((a: any) => ({ ...a, lastUpdate: new Date(a.lastUpdate) })));
        }
        if (alertsRes.ok) {
          const alertsData = await alertsRes.json();
          setAlerts(alertsData.map((al: any) => ({
            ...al,
            createdAt: new Date(al.createdAt),
            triggeredAt: al.triggeredAt ? new Date(al.triggeredAt) : undefined,
            resolvedAt: al.resolvedAt ? new Date(al.resolvedAt) : undefined,
          })));
        }
        if (workersRes.ok) {
          const workersData = await workersRes.json();
          setWorkers(workersData.map((w: any) => ({ ...w, lastHeartbeat: new Date(w.lastHeartbeat) })));
        }
        if (metricsRes.ok) {
          const metricsData = await metricsRes.json();
          setMetrics(metricsData);
        }
      } catch (error) {
        console.error("Error fetching real-time data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [setAssets, setAlerts, setWorkers, setMetrics, setInsights]);

  return { assets, metrics };
}

export function useAnimatedNumber(
  value: number,
  duration: number = 300
): number {
  const ref = useRef(value);
  const frameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);
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
