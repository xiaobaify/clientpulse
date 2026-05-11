import { StatsCards } from "@/components/dashboard/stats-cards";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { UserGrowthChart } from "@/components/dashboard/user-growth-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { mockStats, mockActivities } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">仪表盘</h1>
        <p className="text-muted-foreground">欢迎回来</p>
      </div>

      <StatsCards
        totalUsers={mockStats.totalUsers}
        activeUsers={mockStats.activeUsers}
        monthlyRevenue={mockStats.monthlyRevenue}
        totalProjects={mockStats.totalProjects}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChart data={mockStats.revenueData} />
        <UserGrowthChart data={mockStats.userGrowthData} />
      </div>

      <RecentActivity activities={mockActivities} />
    </div>
  );
}
