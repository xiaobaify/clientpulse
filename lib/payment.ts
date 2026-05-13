// Payment abstraction layer
// Development: simulate payment
// Production: replace with real Alipay/WeChat Pay API calls

export interface PaymentOrder {
  orderId: string;
  planId: string;
  amount: number; // in cents (分)
  paymentMethod: "alipay" | "wechat";
}

export interface PaymentResult {
  success: boolean;
  paymentUrl?: string;
  error?: string;
}

// Create payment - dev mode simulates, prod mode calls real API
export async function createPayment(order: PaymentOrder): Promise<PaymentResult> {
  // In development, simulate a successful payment redirect
  if (process.env.NODE_ENV === "development" || !process.env.ALIPAY_APP_ID) {
    // Return a mock payment URL that will trigger the callback
    const callbackUrl = `${getBaseUrl()}/api/payment/callback?orderId=${order.orderId}&method=${order.paymentMethod}`;
    return {
      success: true,
      paymentUrl: `/payment/simulate?orderId=${order.orderId}&callback=${encodeURIComponent(callbackUrl)}`,
    };
  }

  // Production: call real payment API
  // TODO: Implement real Alipay/WeChat Pay integration
  // Example for Alipay:
  // const alipaySdk = new AlipaySdk({ appId, privateKey, ... });
  // const result = await alipaySdk.exec('alipay.trade.page.pay', { ... });
  // return { success: true, paymentUrl: result };

  return { success: false, error: "支付功能尚未配置" };
}

function getBaseUrl(): string {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}
