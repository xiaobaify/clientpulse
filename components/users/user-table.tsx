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
import { User } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserTableProps {
  users: User[];
}

const statusConfig = {
  active: {
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    label: "活跃",
  },
  inactive: {
    className: "bg-muted text-muted-foreground",
    label: "未激活",
  },
  suspended: {
    className: "bg-destructive/10 text-destructive",
    label: "已封禁",
  },
};

const roleConfig = {
  admin: {
    className: "bg-primary/10 text-primary",
    label: "管理员",
  },
  editor: {
    className: "bg-chart-2/10 text-chart-2",
    label: "编辑者",
  },
  viewer: {
    className: "bg-muted text-muted-foreground",
    label: "查看者",
  },
};

const planLabels = {
  free: "Free",
  pro: "Pro",
  enterprise: "Enterprise",
};

export function UserTable({ users }: UserTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>用户</TableHead>
          <TableHead>角色</TableHead>
          <TableHead>套餐</TableHead>
          <TableHead>状态</TableHead>
          <TableHead>注册时间</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id} className="group">
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {user.status === "active" && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-sm">{user.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {user.email}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className={cn("text-xs", roleConfig[user.role]?.className)}
              >
                {roleConfig[user.role]?.label}
              </Badge>
            </TableCell>
            <TableCell className="text-sm font-medium">
              {planLabels[user.plan]}
            </TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className={cn("text-xs", statusConfig[user.status]?.className)}
              >
                {statusConfig[user.status]?.label}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {new Date(user.createdAt).toLocaleDateString("zh-CN")}
            </TableCell>
            <TableCell className="text-right">
              <Link
                href={`/users/${user.id}`}
                className="inline-flex items-center justify-center rounded-md p-2 opacity-0 group-hover:opacity-100 hover:bg-muted transition-all"
              >
                <Eye className="h-4 w-4" />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
