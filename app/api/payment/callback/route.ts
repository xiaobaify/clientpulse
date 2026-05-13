import { NextResponse } from "next/server";
import { completeOrder } from "@/lib/api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ error: "缺少订单 ID" }, { status: 400 });
    }

    // Complete the order (update status + user plan)
    await completeOrder(orderId);

    // Redirect to billing page with success
    return NextResponse.redirect(
      new URL("/billing?success=true", request.url)
    );
  } catch (err) {
    console.error("Payment callback error:", err);
    return NextResponse.redirect(
      new URL("/billing?error=true", request.url)
    );
  }
}
