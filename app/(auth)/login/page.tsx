"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { signIn } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/");
  }

  return (
    <Card className="border-border/50 bg-card/80 shadow-xl shadow-primary/5 backdrop-blur-sm">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl">登录</CardTitle>
        <p className="text-sm text-muted-foreground">
          欢迎回来，请输入您的账号信息
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">密码</Label>
              <Link
                href="#"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                忘记密码？
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "登录中..." : "登录"}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            没有账号？{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline underline-offset-4"
            >
              立即注册
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
