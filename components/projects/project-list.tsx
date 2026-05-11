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

interface ProjectListProps {
  projects: Project[];
}

const statusColors = {
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  active: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  archived:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
};

const statusLabels = {
  draft: "草稿",
  active: "进行中",
  completed: "已完成",
  archived: "已归档",
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
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell className="font-medium">{project.name}</TableCell>
            <TableCell>{project.clientName}</TableCell>
            <TableCell>
              <Badge className={statusColors[project.status]}>
                {statusLabels[project.status]}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${getProgress(project.stages)}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  {getProgress(project.stages)}%
                </span>
              </div>
            </TableCell>
            <TableCell>
              {new Date(project.updatedAt).toLocaleDateString("zh-CN")}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Link
                  href={`/projects/${project.id}`}
                  className="inline-flex items-center justify-center rounded-md p-2 hover:bg-muted"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <button
                  className="inline-flex items-center justify-center rounded-md p-2 hover:bg-muted"
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
        ))}
      </TableBody>
    </Table>
  );
}
