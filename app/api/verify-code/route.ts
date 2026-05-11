import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email, password, code } = await request.json();

    if (!email || !password || !code) {
      return NextResponse.json(
        { error: "请提供邮箱、密码和验证码" },
        { status: 400 }
      );
    }

    // 查找匹配的未使用验证码
    const { data: records, error: queryError } = await supabaseAdmin
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .order("created_at", { ascending: false })
      .limit(1);

    if (queryError) {
      console.error("DB query error:", JSON.stringify(queryError));
      return NextResponse.json(
        { error: `数据库查询失败: ${queryError.message}` },
        { status: 500 }
      );
    }

    if (!records || records.length === 0) {
      return NextResponse.json(
        { error: "验证码错误或已过期" },
        { status: 400 }
      );
    }

    const record = records[0];

    // 检查是否过期
    if (new Date(record.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "验证码已过期，请重新发送" },
        { status: 400 }
      );
    }

    // 标记验证码为已使用
    await supabaseAdmin
      .from("verification_codes")
      .update({ used: true })
      .eq("id", record.id);

    // 使用 service_role 创建用户（跳过邮箱确认）
    const { error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error("Create user error:", authError.message);
      const msg = authError.message;
      if (
        msg.includes("already registered") ||
        msg.includes("already been registered")
      ) {
        return NextResponse.json(
          { error: "该邮箱已注册，请直接登录" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: `注册失败: ${msg}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("verify-code error:", msg);
    return NextResponse.json({ error: `服务器错误: ${msg}` }, { status: 500 });
  }
}
