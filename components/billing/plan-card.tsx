import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plan } from "@/lib/types";
import { Check, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanCardProps {
  plan: Plan;
  isCurrent?: boolean;
  isPopular?: boolean;
  onSelect?: () => void;
}

export function PlanCard({ plan, isCurrent, isPopular, onSelect }: PlanCardProps) {
  return (
    <Card
      className={cn(
        "relative flex h-full flex-col transition-all duration-300",
        isCurrent
          ? "border-primary shadow-lg shadow-primary/10"
          : isPopular
          ? "border-2 border-primary shadow-xl shadow-primary/15 ring-0 hover:-translate-y-1 hover:shadow-2xl"
          : "border-border hover:border-primary/30 hover:shadow-lg hover:-translate-y-1"
      )}
    >
      {/* Popular gradient accent */}
      {isPopular && (
        <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-primary via-chart-3 to-primary" />
      )}

      {isPopular && !isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="gap-1 px-3 py-1 text-xs shadow-md bg-primary text-primary-foreground">
            <Sparkles className="h-3 w-3" />
            推荐
          </Badge>
        </div>
      )}

      {isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="secondary" className="gap-1 px-3 py-1 text-xs">
            当前套餐
          </Badge>
        </div>
      )}

      <CardHeader className="pb-2 pt-8">
        <div className="text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold">{plan.name}</h3>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col pt-0">
        <div className="mb-6 text-center">
          <span className={cn(
            "font-extrabold tracking-tight",
            isPopular ? "text-5xl" : "text-4xl"
          )}>
            ¥{plan.price}
          </span>
          <span className="ml-1 text-sm text-muted-foreground">
            /{plan.interval === "monthly" ? "月" : "年"}
          </span>
        </div>

        <ul className="mb-6 flex-1 space-y-2.5">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2.5 text-sm">
              <div className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span className="text-foreground/80">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          className={cn(
            "w-full rounded-lg px-6 py-2.5 text-sm font-semibold shadow-md transition-all duration-200 hover:shadow-lg active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
            isCurrent
              ? "border border-primary bg-transparent text-primary shadow-none"
              : isPopular
              ? "bg-primary text-primary-foreground hover:brightness-110"
              : "bg-primary/90 text-primary-foreground hover:bg-primary"
          )}
          disabled={isCurrent}
          onClick={onSelect}
        >
          {isCurrent ? "当前套餐" : "选择套餐"}
        </button>
      </CardContent>
    </Card>
  );
}
