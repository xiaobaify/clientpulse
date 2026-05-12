import { PlanCard } from "@/components/billing/plan-card";
import { fetchPlans } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function PlansPage() {
  const plans = await fetchPlans();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">套餐配置</h1>
        <p className="text-muted-foreground">选择适合您的订阅套餐</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>可用套餐</CardTitle>
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
