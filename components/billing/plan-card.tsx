import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plan } from "@/lib/types";
import { Check, Sparkles } from "lucide-react";

interface PlanCardProps {
  plan: Plan;
  isCurrent?: boolean;
  isPopular?: boolean;
  onSelect?: () => void;
}

export function PlanCard({ plan, isCurrent, isPopular, onSelect }: PlanCardProps) {
  return (
    <Card
      className={`relative flex h-full flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
        isCurrent
          ? "border-primary shadow-lg shadow-primary/10"
          : isPopular
          ? "border-2 border-primary shadow-lg shadow-primary/20"
          : "border-border hover:border-primary/30"
      }`}
    >
      {isPopular && !isCurrent && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <Badge className="gap-1 px-4 py-1 text-sm shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            推荐
          </Badge>
        </div>
      )}

      {isCurrent && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <Badge variant="secondary" className="gap-1 px-4 py-1 text-sm">
            当前套餐
          </Badge>
        </div>
      )}

      <CardHeader className="pb-2 pt-8">
        <div className="text-center">
          <h3 className="text-xl font-bold">{plan.name}</h3>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col pt-0">
        <div className="mb-6 text-center">
          <span className="text-5xl font-extrabold tracking-tight">
            ¥{plan.price}
          </span>
          <span className="ml-1 text-sm text-muted-foreground">
            /{plan.interval === "monthly" ? "月" : "年"}
          </span>
        </div>

        <ul className="mb-8 flex-1 space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3 text-sm">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span className="text-foreground/80">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          className={`w-full rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-300 hover:shadow-lg hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${
            isCurrent
              ? "border border-primary bg-transparent text-primary shadow-none"
              : isPopular
              ? "bg-gradient-to-r from-primary to-primary/80"
              : "bg-gradient-to-r from-primary/90 to-primary/70"
          }`}
          disabled={isCurrent}
          onClick={onSelect}
        >
          {isCurrent ? "当前套餐" : "选择套餐"}
        </button>
      </CardContent>
    </Card>
  );
}
