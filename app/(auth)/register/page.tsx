"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "verify">("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
  const [verifyError, setVerifyError] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  async function handleSendCode(e: React.FormEvent) {
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
    try {
      const res = await fetch("/api/send-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "发送失败");
        setLoading(false);
        return;
      }

      setCountdown(60);
      setStep("verify");
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch {
      setError("网络错误，请重试");
    }
    setLoading(false);
  }

  function handleCodeChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((c) => c !== "") && index === 5) {
      verifyCode(newCode.join(""));
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newCode = [...code];
    for (let i = 0; i < 6; i++) {
      newCode[i] = pasted[i] || "";
    }
    setCode(newCode);
    const nextEmpty = newCode.findIndex((c) => c === "");
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();

    if (newCode.every((c) => c !== "")) {
      verifyCode(newCode.join(""));
    }
  }

  const verifyCode = useCallback(
    async (codeStr: string) => {
      setVerifyError("");
      setVerifyLoading(true);

      try {
        const res = await fetch("/api/verify-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, code: codeStr }),
        });
        const data = await res.json();

        if (!res.ok) {
          setVerifyError(data.error || "验证失败");
          setVerifyLoading(false);
          return;
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          router.replace("/login");
          return;
        }

        router.replace("/");
      } catch {
        setVerifyError("网络错误，请重试");
        setVerifyLoading(false);
      }
    },
    [email, password, router]
  );

  async function handleResend() {
    if (countdown > 0) return;
    setVerifyError("");
    setLoading(true);

    try {
      const res = await fetch("/api/send-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setVerifyError(data.error || "发送失败");
        setLoading(false);
        return;
      }

      setCountdown(60);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch {
      setVerifyError("网络错误");
    }
    setLoading(false);
  }

  if (step === "verify") {
    return (
      <Card className="border-border/50 bg-card/80 shadow-xl shadow-primary/5 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">验证邮箱</CardTitle>
          <p className="text-sm text-muted-foreground">
            验证码已发送至
            <br />
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center gap-2">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className="h-12 w-12 rounded-lg border border-input bg-background text-center text-xl font-semibold tabular-nums transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={verifyLoading}
              />
            ))}
          </div>

          {verifyError && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2">
              <p className="text-center text-sm text-destructive">{verifyError}</p>
            </div>
          )}

          {verifyLoading && (
            <p className="text-center text-sm text-muted-foreground">正在注册...</p>
          )}

          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-sm text-muted-foreground">
                {countdown} 秒后可重新发送
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="text-sm font-medium text-primary hover:underline underline-offset-4"
              >
                {loading ? "发送中..." : "重新发送验证码"}
              </button>
            )}
          </div>

          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => {
              setStep("form");
              setCode(["", "", "", "", "", ""]);
              setVerifyError("");
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            返回修改邮箱
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/80 shadow-xl shadow-primary/5 backdrop-blur-sm">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl">创建账号</CardTitle>
        <p className="text-sm text-muted-foreground">
          注册后即可开始管理客户项目
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSendCode}>
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
            <div className="rounded-lg bg-destructive/10 px-3 py-2">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "发送中..." : "发送验证码"}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            已有账号？{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline underline-offset-4"
            >
              立即登录
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
