import { PlanCard } from "@/components/billing/plan-card";
import { fetchPlans } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function PlansPage() {
  const plans = await fetchPlans();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">套餐配置</h1>
        <p className="mt-2 text-muted-foreground">选择适合您的订阅套餐</p>
      </div>

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isPopular={plan.id === "pro"}
          />
        ))}
      </div>
    </div>
  );
}
