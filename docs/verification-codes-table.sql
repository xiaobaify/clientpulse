create table if not exists verification_codes (
  id         uuid primary key default gen_random_uuid(),
  email      text        not null,
  code       text        not null,
  expires_at timestamptz not null,
  used       boolean     not null default false,
  created_at timestamptz not null default now()
);

-- 快速按邮箱+验证码查询
create index if not exists idx_verification_codes_email_code
  on verification_codes (email, code);

-- 定期清理过期记录（可选，手动或 cron 执行）
-- delete from verification_codes where expires_at < now();

-- RLS：anon 可插入和查询（API 路由通过 service_role 操作则不需要）
alter table verification_codes enable row level security;

create policy "anon_insert_codes" on verification_codes
  for insert to anon with check (true);

create policy "anon_select_codes" on verification_codes
  for select to anon using (true);

create policy "anon_update_codes" on verification_codes
  for update to anon using (true);
