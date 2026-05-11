import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendVerificationCodeEmail } from "@/lib/email";

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
      console.error("DB insert error:", JSON.stringify(insertError));
      return NextResponse.json(
        { error: `数据库写入失败: ${insertError.message}` },
        { status: 500 }
      );
    }

    // 发送邮件
    try {
      await sendVerificationCodeEmail(email, code);
    } catch (mailErr: unknown) {
      const msg = mailErr instanceof Error ? mailErr.message : String(mailErr);
      console.error("SMTP error:", msg);
      return NextResponse.json(
        { error: `邮件发送失败: ${msg}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("send-verification-code error:", msg);
    return NextResponse.json({ error: `服务器错误: ${msg}` }, { status: 500 });
  }
}
