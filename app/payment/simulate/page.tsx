"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, CheckCircle2, CreditCard, Smartphone } from "lucide-react";
import { useState, Suspense } from "react";

function SimulatePaymentContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const callback = searchParams.get("callback");
  const method = searchParams.get("method");
  const [processing, setProcessing] = useState(false);

  const isAlipay = method === "alipay";

  function handleConfirm() {
    setProcessing(true);
    // Simulate payment processing delay then redirect to callback
    setTimeout(() => {
      if (callback) {
        window.location.href = callback;
      }
    }, 1500);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-chart-3/5" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">ClientPulse</h1>
        </div>

        <Card className="border-border/50 bg-card/80 shadow-xl backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              {isAlipay ? (
                <CreditCard className="h-8 w-8 text-primary" />
              ) : (
                <Smartphone className="h-8 w-8 text-primary" />
              )}
            </div>
            <CardTitle className="text-lg">
              {isAlipay ? "支付宝支付" : "微信支付"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              订单号: {orderId?.slice(0, 8)}...
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {processing ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">
                  支付处理中...
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-lg bg-muted/50 p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    模拟支付环境
                  </p>
                  <p className="text-xs text-muted-foreground">
                    开发阶段：点击确认即模拟支付成功
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.history.back()}
                  >
                    取消
                  </Button>
                  <Button className="flex-1 gap-2" onClick={handleConfirm}>
                    <CheckCircle2 className="h-4 w-4" />
                    确认支付
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SimulatePaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <SimulatePaymentContent />
    </Suspense>
  );
}
