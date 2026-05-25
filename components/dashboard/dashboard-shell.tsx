"use client";

import { useRealtimeData } from "@/hooks/use-realtime-data";
import { useDashboardStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopNavbar } from "@/components/dashboard/top-navbar";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export function DashboardShell() {
  const { sidebarCollapsed } = useDashboardStore();

  // Initialize real-time data
  useRealtimeData();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-200",
          sidebarCollapsed ? "ml-16" : "ml-56"
        )}
      >
        {/* Top Navbar */}
        <TopNavbar />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <DashboardContent />
        </main>
      </div>
    </div>
  );
}
