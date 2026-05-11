import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { UserGrowthChart } from "@/components/dashboard/user-growth-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { fetchStats, fetchProjects } from "@/lib/api";
import type { Activity } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const stats = await fetchStats();
  const projects = await fetchProjects();

  // Derive recent activities from real data
  const activities: Activity[] = projects.slice(0, 5).map((p, i) => ({
    id: String(i + 1),
    type: "project_update" as const,
    description: `项目「${p.name}」— ${p.status === "active" ? "进行中" : p.status === "completed" ? "已完成" : p.status}`,
    timestamp: p.updatedAt,
  }));

  // Placeholder chart data (requires billing table for real revenue)
  const revenueData = [
    { month: "1月", revenue: 0 },
    { month: "2月", revenue: 0 },
    { month: "3月", revenue: 0 },
    { month: "4月", revenue: 0 },
    { month: "5月", revenue: 0 },
  ];

  const userGrowthData = [
    { month: "1月", users: stats.totalUsers },
    { month: "2月", users: stats.totalUsers },
    { month: "3月", users: stats.totalUsers },
    { month: "4月", users: stats.totalUsers },
    { month: "5月", users: stats.totalUsers },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">仪表盘</h1>
              <p className="text-muted-foreground">欢迎回来</p>
            </div>

            <StatsCards
              totalUsers={stats.totalUsers}
              activeUsers={stats.activeUsers}
              monthlyRevenue={stats.monthlyRevenue}
              totalProjects={stats.totalProjects}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <RevenueChart data={revenueData} />
              <UserGrowthChart data={userGrowthData} />
            </div>

            <RecentActivity activities={activities} />
          </div>
        </main>
      </div>
    </div>
  );
}
