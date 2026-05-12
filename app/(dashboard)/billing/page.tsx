import { PlanCard } from "@/components/billing/plan-card";
import { UsageMeter } from "@/components/billing/usage-meter";
import { fetchPlans } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const plans = await fetchPlans();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">订阅计费</h1>
        <p className="text-muted-foreground">管理您的订阅套餐</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <UsageMeter title="已用项目" used={0} total={-1} unit="个" />
        <UsageMeter title="已用存储" used={0} total={10} unit="GB" />
        <UsageMeter title="团队成员" used={0} total={-1} unit="人" />
        <UsageMeter title="API 调用" used={0} total={10000} unit="次" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>选择套餐</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
