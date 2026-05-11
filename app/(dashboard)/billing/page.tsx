import { PlanCard } from "@/components/billing/plan-card";
import { UsageMeter } from "@/components/billing/usage-meter";
import { mockPlans } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">订阅计费</h1>
        <p className="text-muted-foreground">管理您的订阅套餐</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <UsageMeter title="已用项目" used={5} total={-1} unit="个" />
        <UsageMeter title="已用存储" used={3.2} total={10} unit="GB" />
        <UsageMeter title="团队成员" used={8} total={-1} unit="人" />
        <UsageMeter title="API 调用" used={1250} total={10000} unit="次" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>选择套餐</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {mockPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrent={plan.id === "pro"}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
