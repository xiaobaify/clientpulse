import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  port: 465,
  secure: true,
  auth: {
    user: "2938193230@qq.com",
    pass: process.env.QQ_SMTP_PASS,
  },
});

export async function sendVerificationCodeEmail(
  email: string,
  code: string
): Promise<void> {
  await transporter.sendMail({
    from: '"SaaS Admin" <2938193230@qq.com>',
    to: email,
    subject: "【SaaS Admin】你的注册验证码",
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; max-width:480px; margin:0 auto; padding:40px 20px;">
        <h1 style="font-size:24px; font-weight:700; color:#18181b; text-align:center; margin:0 0 24px;">注册验证码</h1>
        <p style="font-size:15px; color:#71717a; line-height:1.6; margin:0 0 8px;">你好，</p>
        <p style="font-size:15px; color:#71717a; line-height:1.6; margin:0 0 24px;">
          你正在注册 SaaS Admin 账号，请使用以下验证码完成验证：
        </p>
        <div style="text-align:center; margin:0 0 24px;">
          <div style="display:inline-block; background-color:#f4f4f5; border-radius:8px; padding:16px 32px;">
            <span style="font-size:32px; font-weight:700; letter-spacing:8px; color:#18181b; font-family:monospace;">
              ${code}
            </span>
          </div>
        </div>
        <p style="font-size:14px; color:#a1a1aa; line-height:1.6; margin:0 0 8px;">
          验证码有效期为 <strong style="color:#71717a;">10 分钟</strong>。
        </p>
        <p style="font-size:14px; color:#a1a1aa; line-height:1.6; margin:0;">
          如果你没有尝试注册，请忽略此邮件。
        </p>
        <hr style="border:none; border-top:1px solid #e4e4e7; margin:32px 0 20px;" />
        <p style="font-size:12px; color:#a1a1aa; line-height:1.5; margin:0;">
          此邮件由系统自动发送，请勿回复。<br />
          SaaS Admin &mdash; 项目管理平台
        </p>
      </div>
    `,
  });
}
