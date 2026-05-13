import { NextResponse } from "next/server";
import { createOrder } from "@/lib/api";
import { createPayment } from "@/lib/payment";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { planId, paymentMethod } = await request.json();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    // Get plan details
    const plans = [
      { id: "free", price: 0 },
      { id: "pro", price: 9900 },
      { id: "enterprise", price: 29900 },
    ];
    const plan = plans.find((p) => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: "无效的套餐" }, { status: 400 });
    }

    // Create order in database
    const orderId = await createOrder({
      userId: user.id,
      planId,
      amount: plan.price,
      paymentMethod,
    });

    // Create payment
    const result = await createPayment({
      orderId,
      planId,
      amount: plan.price,
      paymentMethod: paymentMethod as "alipay" | "wechat",
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "创建支付失败" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      orderId,
      paymentUrl: result.paymentUrl,
    });
  } catch (err) {
    console.error("Payment create error:", err);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
