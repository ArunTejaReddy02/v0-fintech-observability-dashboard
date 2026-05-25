import { create } from "zustand";
import type {
  MarketAsset,
  Alert,
  Worker,
  SystemMetrics,
  AIInsight,
  Notification,
} from "./types";

interface DashboardState {
  // Sidebar state
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Active view
  activeView: string;
  setActiveView: (view: string) => void;

  // Market data
  assets: MarketAsset[];
  selectedAsset: string | null;
  setAssets: (assets: MarketAsset[]) => void;
  updateAsset: (id: string, updates: Partial<MarketAsset>) => void;
  setSelectedAsset: (id: string | null) => void;

  // Alerts
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Alert) => void;
  updateAlert: (id: string, updates: Partial<Alert>) => void;

  // Workers
  workers: Worker[];
  setWorkers: (workers: Worker[]) => void;
  updateWorker: (id: string, updates: Partial<Worker>) => void;

  // System metrics
  metrics: SystemMetrics;
  setMetrics: (metrics: SystemMetrics) => void;

  // AI Insights
  insights: AIInsight[];
  setInsights: (insights: AIInsight[]) => void;

  // Notifications
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Connection status
  isConnected: boolean;
  setConnectionStatus: (status: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  // Sidebar
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  // Active view
  activeView: "dashboard",
  setActiveView: (view) => set({ activeView: view }),

  // Market data
  assets: [],
  selectedAsset: null,
  setAssets: (assets) => set({ assets }),
  updateAsset: (id, updates) =>
    set((state) => ({
      assets: state.assets.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),
  setSelectedAsset: (id) => set({ selectedAsset: id }),

  // Alerts
  alerts: [],
  setAlerts: (alerts) => set({ alerts }),
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
  updateAlert: (id, updates) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),

  // Workers
  workers: [],
  setWorkers: (workers) => set({ workers }),
  updateWorker: (id, updates) =>
    set((state) => ({
      workers: state.workers.map((w) =>
        w.id === id ? { ...w, ...updates } : w
      ),
    })),

  // System metrics
  metrics: {
    queueDepth: 0,
    ticksPerSec: 0,
    redisOpsPerSec: 0,
    dbLatencyMs: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    networkIn: 0,
    networkOut: 0,
  },
  setMetrics: (metrics) => set({ metrics }),

  // AI Insights
  insights: [],
  setInsights: (insights) => set({ insights }),

  // Notifications
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  // Search
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Connection
  isConnected: true,
  setConnectionStatus: (status) => set({ isConnected: status }),
}));
