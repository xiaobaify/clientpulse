"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import { sendOtp, verifyOtp } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  // Countdown timer
  useEffect(() => {
    if (step !== "otp" || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Focus first OTP input on step change
  useEffect(() => {
    if (step === "otp") {
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  async function handleSendOtp(e: React.FormEvent) {
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
    const { error: authError } = await sendOtp(email);
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

    setStep("otp");
    setCountdown(60);
  }

  async function handleResend() {
    setError("");
    setLoading(true);
    const { error: authError } = await sendOtp(email);
    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    setCountdown(60);
    setOtp(["", "", "", "", "", ""]);
    otpRefs.current[0]?.focus();
  }

  function handleOtpChange(index: number, value: string) {
    // Only allow digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are filled
    if (newOtp.every((d) => d !== "")) {
      handleVerify(newOtp.join(""));
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const focusIndex = Math.min(pasted.length, 5);
    otpRefs.current[focusIndex]?.focus();
    if (newOtp.every((d) => d !== "")) {
      handleVerify(newOtp.join(""));
    }
  }

  async function handleVerify(token: string) {
    setError("");
    setLoading(true);

    const { error: authError } = await verifyOtp(email, token);
    setLoading(false);

    if (authError) {
      if (authError.message.includes("expired") || authError.message.includes("invalid")) {
        setError("验证码无效或已过期，请重新发送");
      } else {
        setError(authError.message);
      }
      return;
    }

    router.push("/");
  }

  if (step === "otp") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">验证邮箱</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              验证码已发送至 <span className="font-medium text-foreground">{email}</span>
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-center gap-2">
                {otp.map((digit, i) => (
                  <Input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="h-12 w-12 text-center text-lg font-semibold"
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    onPaste={i === 0 ? handleOtpPaste : undefined}
                  />
                ))}
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <Button
                className="w-full"
                disabled={loading || otp.some((d) => d === "")}
                onClick={() => handleVerify(otp.join(""))}
              >
                {loading ? "验证中..." : "验证"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                {countdown > 0 ? (
                  <span>{countdown} 秒后可重新发送</span>
                ) : (
                  <button
                    type="button"
                    className="text-primary underline-offset-4 hover:underline"
                    onClick={handleResend}
                    disabled={loading}
                  >
                    重新发送验证码
                  </button>
                )}
              </div>

              <p className="text-center text-sm text-muted-foreground">
                <button
                  type="button"
                  className="text-primary underline-offset-4 hover:underline"
                  onClick={() => {
                    setStep("form");
                    setError("");
                    setOtp(["", "", "", "", "", ""]);
                  }}
                >
                  返回修改邮箱
                </button>
              </p>
            </div>
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
          <form className="space-y-4" onSubmit={handleSendOtp}>
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
              {loading ? "发送中..." : "发送验证码"}
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
