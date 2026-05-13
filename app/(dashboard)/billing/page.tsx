import { UsageMeter } from "@/components/billing/usage-meter";
import { fetchPlans, fetchStats } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BillingPageClient } from "./billing-client";

export const revalidate = 30;

export default async function BillingPage() {
  const [plans, stats] = await Promise.all([fetchPlans(), fetchStats()]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">订阅计费</h1>
        <p className="text-muted-foreground">管理您的订阅套餐</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <UsageMeter title="已用项目" used={stats.totalProjects} total={-1} unit="个" />
        <UsageMeter title="已用存储" used={0} total={10} unit="GB" />
        <UsageMeter title="团队成员" used={stats.totalUsers} total={-1} unit="人" />
        <UsageMeter title="月收入" used={stats.monthlyRevenue} total={0} unit="元" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">选择套餐</CardTitle>
        </CardHeader>
        <CardContent>
          <BillingPageClient plans={plans} />
        </CardContent>
      </Card>
    </div>
  );
}
