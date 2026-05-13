"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Link2 } from "lucide-react";
import { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProjectListProps {
  projects: Project[];
}

const statusConfig = {
  draft: {
    className: "bg-muted text-muted-foreground",
    label: "草稿",
  },
  active: {
    className: "bg-primary/10 text-primary",
    label: "进行中",
  },
  completed: {
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    label: "已完成",
  },
  archived: {
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    label: "已归档",
  },
};

export function ProjectList({ projects }: ProjectListProps) {
  function getProgress(stages: Project["stages"]) {
    if (stages.length === 0) return 0;
    const completed = stages.filter((s) => s.status === "completed").length;
    return Math.round((completed / stages.length) * 100);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>项目名称</TableHead>
          <TableHead>客户</TableHead>
          <TableHead>状态</TableHead>
          <TableHead>进度</TableHead>
          <TableHead>更新时间</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => {
          const progress = getProgress(project.stages);
          return (
            <TableRow key={project.id} className="group">
              <TableCell className="font-medium">{project.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {project.clientName}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs",
                    statusConfig[project.status]?.className
                  )}
                >
                  {statusConfig[project.status]?.label}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        progress === 100
                          ? "bg-emerald-500"
                          : progress > 60
                          ? "bg-primary"
                          : "bg-primary/60"
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {progress}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(project.updatedAt).toLocaleDateString("zh-CN")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center justify-center rounded-md p-2 hover:bg-muted transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button
                    className="inline-flex items-center justify-center rounded-md p-2 hover:bg-muted transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/p/${project.shareId}`
                      );
                    }}
                  >
                    <Link2 className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
