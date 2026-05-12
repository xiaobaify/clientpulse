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
    },
    {
      title: "活跃用户",
      value: activeUsers.toLocaleString(),
      icon: Activity,
      description: activeUsers > 0 ? "当前活跃用户数" : "暂无活跃用户",
    },
    {
      title: "月收入",
      value: `¥${monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: monthlyRevenue > 0 ? "本月累计收入" : "尚未产生收入",
    },
    {
      title: "项目数",
      value: totalProjects.toString(),
      icon: FolderKanban,
      description: totalProjects > 0 ? "当前项目总数" : "还没有项目",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
