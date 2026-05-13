"use client";

import { UserTable } from "@/components/users/user-table";
import { fetchUsers } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Users, Loader2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import type { User } from "@/lib/types";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">用户管理</h1>
        <p className="text-muted-foreground">管理平台所有用户</p>
      </div>

      {users.length > 0 ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                用户列表
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({filteredUsers.length})
                </span>
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索用户名或邮箱..."
                  className="pl-9 w-64 h-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <UserTable users={filteredUsers} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Users className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="font-semibold">暂无用户</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                用户注册后将显示在这里
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
