import { fetchPlans } from "@/lib/api";
import { PlansPageClient } from "./plans-client";

export const revalidate = 60;

export default async function PlansPage() {
  const plans = await fetchPlans();

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">套餐配置</h1>
        <p className="mt-2 text-muted-foreground">选择适合您的订阅套餐</p>
      </div>

      <PlansPageClient plans={plans} />
    </div>
  );
}
