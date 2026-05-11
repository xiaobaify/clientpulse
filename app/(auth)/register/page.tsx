"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { signUp } from "@/lib/api";
import Link from "next/link";

export default function RegisterPage() {
  const [step, setStep] = useState<"form" | "sent">("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }
    if (password.length < 6) {
      setError("密码长度至少 6 位");
      return;
    }

    setLoading(true);

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error: authError } = await signUp(
      email,
      password,
      `${origin}/auth/callback`
    );
    setLoading(false);

    if (authError) {
      const msg = authError.message;
      if (msg.includes("already registered") || msg.includes("already been registered")) {
        setError("该邮箱已注册，请直接登录");
      } else if (msg.includes("rate limit")) {
        setError("发送过于频繁，请稍后再试");
      } else {
        setError(msg);
      }
      return;
    }

    setStep("sent");
  }

  if (step === "sent") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">查收邮件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              验证邮件已发送至
            </p>
            <p className="font-medium text-lg">{email}</p>
            <p className="text-sm text-muted-foreground">
              请点击邮件中的链接完成注册，链接有效期为 24 小时。
            </p>
            <p className="text-sm text-muted-foreground">
              没有收到？请检查垃圾邮件文件夹。
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setStep("form");
                setError("");
              }}
            >
              返回修改邮箱
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">注册</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="至少 6 位"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="再次输入密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "发送中..." : "注册"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            已有账号？{" "}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              立即登录
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
