import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      className={`relative flex flex-col ${
        isCurrent
          ? "border-primary shadow-lg shadow-primary/10"
          : isPopular
          ? "border-primary/50 shadow-md"
          : "border-border"
      }`}
    >
      {isPopular && !isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="gap-1 px-3 py-0.5">
            <Sparkles className="h-3 w-3" />
            推荐
          </Badge>
        </div>
      )}

      {isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="secondary" className="gap-1 px-3 py-0.5">
            当前套餐
          </Badge>
        </div>
      )}

      <CardHeader className="pb-2 pt-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold">{plan.name}</h3>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col pt-0">
        <div className="mb-6 text-center">
          <span className="text-4xl font-bold tracking-tight">
            ¥{plan.price}
          </span>
          <span className="ml-1 text-sm text-muted-foreground">
            /{plan.interval === "monthly" ? "月" : "年"}
          </span>
        </div>

        <ul className="mb-8 flex-1 space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2.5 text-sm">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span className="text-foreground/80">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          className="w-full"
          size="lg"
          variant={isCurrent ? "outline" : isPopular ? "default" : "outline"}
          disabled={isCurrent}
          onClick={onSelect}
        >
          {isCurrent ? "当前套餐" : "选择套餐"}
        </Button>
      </CardContent>
    </Card>
  );
}
