import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { fetchStats, fetchProjects } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Users, FileText, Share2, ArrowRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 30;

const steps = [
  {
    icon: Plus,
    title: "创建第一个项目",
    description: "点击新建项目，填写客户名称和项目信息",
    href: "/projects",
  },
  {
    icon: Share2,
    title: "分享项目链接",
    description: "生成专属分享链接，客户无需注册即可查看进度",
    href: "/projects",
  },
  {
    icon: FileText,
    title: "上传项目文件",
    description: "在设计稿、原型图等阶段上传交付物",
    href: "/projects",
  },
  {
    icon: Users,
    title: "邀请团队成员",
    description: "添加协作者，共同管理客户项目",
    href: "/users",
  },
];

export default async function HomePage() {
  const [stats, projects] = await Promise.all([fetchStats(), fetchProjects()]);

  const hasData = projects.length > 0 || stats.totalUsers > 0;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">仪表盘</h1>
              <p className="text-muted-foreground">
                {hasData
                  ? "欢迎回来"
                  : "欢迎使用 ClientPulse，从这里开始你的第一个项目"}
              </p>
            </div>

            <StatsCards
              totalUsers={stats.totalUsers}
              activeUsers={stats.activeUsers}
              monthlyRevenue={stats.monthlyRevenue}
              totalProjects={stats.totalProjects}
            />

            {hasData ? (
              <Card>
                <CardHeader>
                  <CardTitle>最近项目</CardTitle>
                </CardHeader>
                <CardContent>
                  {projects.length > 0 ? (
                    <div className="space-y-2">
                      {projects.slice(0, 5).map((p) => (
                        <Link
                          key={p.id}
                          href={`/projects/${p.id}`}
                          className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted transition-colors"
                        >
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {p.clientName}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <EmptyHint />
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>快速开始</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {steps.map((step) => {
                      const Icon = step.icon;
                      return (
                        <Link
                          key={step.title}
                          href={step.href}
                          className="flex items-start gap-3 rounded-lg border p-4 hover:bg-muted transition-colors"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium text-sm">{step.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {step.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex justify-center">
                    <Link
                      href="/projects"
                      className={cn(buttonVariants({ size: "lg" }), "gap-1.5")}
                    >
                      <Plus className="h-5 w-5" />
                      创建第一个项目
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function EmptyHint() {
  return (
    <div className="py-8 text-center text-muted-foreground">
      <p>还没有项目</p>
      <Link
        href="/projects"
        className={cn(
          buttonVariants({ variant: "link" }),
          "mt-1"
        )}
      >
        点击创建第一个项目
      </Link>
    </div>
  );
}
