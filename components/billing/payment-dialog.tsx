"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, Loader2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: {
    id: string;
    name: string;
    price: number;
  };
}

export function PaymentDialog({ open, onOpenChange, plan }: PaymentDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState<"alipay" | "wechat" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePay() {
    if (!selectedMethod) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          paymentMethod: selectedMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "创建支付失败");
        setLoading(false);
        return;
      }

      // Redirect to payment page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } catch {
      setError("网络错误，请重试");
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>选择支付方式</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Plan summary */}
          <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{plan.name} 套餐</p>
              <p className="text-lg font-bold">¥{plan.price}/月</p>
            </div>
          </div>

          {/* Payment methods */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedMethod("alipay")}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
                selectedMethod === "alipay"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              )}
            >
              <CreditCard className="h-8 w-8 text-[#1677FF]" />
              <span className="text-sm font-medium">支付宝</span>
            </button>
            <button
              onClick={() => setSelectedMethod("wechat")}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
                selectedMethod === "wechat"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              )}
            >
              <Smartphone className="h-8 w-8 text-[#07C160]" />
              <span className="text-sm font-medium">微信支付</span>
            </button>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button
              className="flex-1"
              disabled={!selectedMethod || loading}
              onClick={handlePay}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              立即支付
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
