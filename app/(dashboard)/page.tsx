import { StatsCards } from "@/components/dashboard/stats-cards";
import { fetchStats, fetchProjects } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Plus, Users, FileText, Share2, ArrowRight, FolderKanban } from "lucide-react";
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

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  active: "bg-primary/10 text-primary",
  completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  archived: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

const statusLabels: Record<string, string> = {
  draft: "草稿",
  active: "进行中",
  completed: "已完成",
  archived: "已归档",
};

export default async function HomePage() {
  const [stats, projects] = await Promise.all([fetchStats(), fetchProjects()]);

  const hasData = projects.length > 0 || stats.totalUsers > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">仪表盘</h1>
        <p className="text-muted-foreground">
          {hasData
            ? "欢迎回来，这是您的项目概览"
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>最近项目</CardTitle>
            <Link
              href="/projects"
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              查看全部 <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {projects.length > 0 ? (
              <div className="space-y-2">
                {projects.slice(0, 5).map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.id}`}
                    className="group flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 hover:border-primary/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FolderKanban className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{p.name}</p>
                          <Badge
                            variant="secondary"
                            className={cn("text-[10px] px-1.5 py-0", statusColors[p.status])}
                          >
                            {statusLabels[p.status]}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {p.clientName}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Link
                    key={step.title}
                    href={step.href}
                    className="group flex items-start gap-3 rounded-lg border p-4 hover:bg-muted/50 hover:border-primary/20 transition-all"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-5 w-5" />
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
  );
}


function EmptyHint() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <FileText className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="font-medium text-sm">还没有项目</p>
      <p className="mt-1 text-xs text-muted-foreground">
        创建你的第一个项目，开始管理客户交付
      </p>
      <Link
        href="/projects"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "mt-4"
        )}
      >
        <Plus className="h-4 w-4 mr-1" />
        创建项目
      </Link>
    </div>
  );
}
