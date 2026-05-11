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
      description: "+12% 较上月",
    },
    {
      title: "活跃用户",
      value: activeUsers.toLocaleString(),
      icon: Activity,
      description: "+8% 较上月",
    },
    {
      title: "月收入",
      value: `¥${monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: "+15% 较上月",
    },
    {
      title: "项目数",
      value: totalProjects.toString(),
      icon: FolderKanban,
      description: "+5 本月新增",
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
