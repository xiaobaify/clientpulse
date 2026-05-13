"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Zap } from "lucide-react";

interface PasswordGateProps {
  onSubmit: (password: string) => void;
  error?: string;
}

export function PasswordGate({ onSubmit, error }: PasswordGateProps) {
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(password);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-chart-3/5" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-chart-3/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-sm px-4">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">ClientPulse</h1>
        </div>

        <Card className="border-border/50 bg-card/80 shadow-xl shadow-primary/5 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardTitle className="text-lg">项目受密码保护</CardTitle>
            <p className="text-sm text-muted-foreground">
              请输入访问密码以查看项目进度
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="请输入访问密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-center"
              />
              {error && (
                <div className="rounded-lg bg-destructive/10 px-3 py-2">
                  <p className="text-sm text-destructive text-center">{error}</p>
                </div>
              )}
              <Button type="submit" className="w-full">
                访问项目
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
