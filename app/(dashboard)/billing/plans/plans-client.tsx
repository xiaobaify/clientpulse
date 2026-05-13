"use client";

import { useState } from "react";
import { PlanCard } from "@/components/billing/plan-card";
import { PaymentDialog } from "@/components/billing/payment-dialog";
import type { Plan } from "@/lib/types";

interface PlansPageClientProps {
  plans: Plan[];
}

export function PlansPageClient({ plans }: PlansPageClientProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleSelectPlan(plan: Plan) {
    setSelectedPlan(plan);
    setDialogOpen(true);
  }

  return (
    <>
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
        {plans.map((plan, i) => (
          <div
            key={plan.id}
            className="animate-fade-in-up h-full"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <PlanCard
              plan={plan}
              isPopular={plan.id === "pro"}
              onSelect={() => handleSelectPlan(plan)}
            />
          </div>
        ))}
      </div>

      {selectedPlan && (
        <PaymentDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          plan={selectedPlan}
        />
      )}
    </>
  );
}
