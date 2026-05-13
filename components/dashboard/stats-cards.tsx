import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, DollarSign, FolderKanban } from "lucide-react";

interface StatsCardsProps {
  totalUsers: number;
  activeUsers: number;
  monthlyRevenue: number;
  totalProjects: number;
}

export function StatsCards({
  totalUsers,
  activeUsers,
  monthlyRevenue,
  totalProjects,
}: StatsCardsProps) {
  const stats = [
    {
      title: "总用户",
      value: totalUsers.toLocaleString(),
      icon: Users,
      description: totalUsers > 0 ? "已注册用户总数" : "等待第一位用户注册",
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "活跃用户",
      value: activeUsers.toLocaleString(),
      icon: Activity,
      description: activeUsers > 0 ? "当前活跃用户数" : "暂无活跃用户",
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
    },
    {
      title: "月收入",
      value: `¥${monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: monthlyRevenue > 0 ? "本月累计收入" : "尚未产生收入",
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      title: "项目数",
      value: totalProjects.toString(),
      icon: FolderKanban,
      description: totalProjects > 0 ? "当前项目总数" : "还没有项目",
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="animate-fade-in-up group hover:shadow-md transition-shadow"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
