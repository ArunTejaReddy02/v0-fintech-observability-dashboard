import { Providers } from "@/components/providers";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function Page() {
  return (
    <Providers>
      <DashboardShell />
    </Providers>
  );
}
