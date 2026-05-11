import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

export async function GET() {
  const results: Record<string, unknown> = {};

  // 1. 检查环境变量
  results.env = {
    QQ_SMTP_PASS_SET: !!process.env.QQ_SMTP_PASS,
    QQ_SMTP_PASS_LENGTH: process.env.QQ_SMTP_PASS?.length ?? 0,
    SUPABASE_SERVICE_ROLE_KEY_SET: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  };

  // 2. 测试数据库写入
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const testCode = "000000";
    const testEmail = `debug-test-${Date.now()}@test.local`;
    const expiresAt = new Date(Date.now() + 60 * 1000).toISOString();

    const { error: insertError } = await supabaseAdmin
      .from("verification_codes")
      .insert({ email: testEmail, code: testCode, expires_at: expiresAt });

    if (insertError) {
      results.db_insert = {
        success: false,
        error: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint,
      };
    } else {
      results.db_insert = { success: true };
      // 清理测试数据
      await supabaseAdmin
        .from("verification_codes")
        .delete()
        .eq("email", testEmail);
    }
  } catch (dbErr) {
    results.db_insert = {
      success: false,
      error: dbErr instanceof Error ? dbErr.message : String(dbErr),
    };
  }

  // 3. 测试 SMTP 连接
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.qq.com",
      port: 465,
      secure: true,
      auth: {
        user: "2938193230@qq.com",
        pass: process.env.QQ_SMTP_PASS,
      },
      connectionTimeout: 10000,
    });

    await transporter.verify();
    results.smtp_connect = { success: true };
  } catch (smtpErr) {
    results.smtp_connect = {
      success: false,
      error: smtpErr instanceof Error ? smtpErr.message : String(smtpErr),
      code: (smtpErr as Record<string, string>).code,
      command: (smtpErr as Record<string, string>).command,
    };
  }

  return NextResponse.json(results, null, 2);
}
