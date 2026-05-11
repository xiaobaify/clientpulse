import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendVerificationCodeEmail } from "@/lib/resend";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "请提供邮箱地址" }, { status: 400 });
    }

    // 生成6位数字验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // 清除该邮箱的旧验证码
    await supabaseAdmin
      .from("verification_codes")
      .delete()
      .eq("email", email)
      .eq("used", false);

    // 存入数据库
    const { error: insertError } = await supabaseAdmin
      .from("verification_codes")
      .insert({ email, code, expires_at: expiresAt });

    if (insertError) {
      console.error("Insert verification code error:", insertError);
      return NextResponse.json({ error: "验证码生成失败" }, { status: 500 });
    }

    // 发送邮件
    await sendVerificationCodeEmail(email, code);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("send-verification-code error:", err);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
