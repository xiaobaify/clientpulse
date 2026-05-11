import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plan } from "@/lib/types";
import { Check } from "lucide-react";

interface PlanCardProps {
  plan: Plan;
  isCurrent?: boolean;
  onSelect?: () => void;
}

export function PlanCard({ plan, isCurrent, onSelect }: PlanCardProps) {
  return (
    <Card className={isCurrent ? "border-primary" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{plan.name}</CardTitle>
          {isCurrent && <Badge>当前套餐</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <span className="text-3xl font-bold">¥{plan.price}</span>
          <span className="text-muted-foreground">/{plan.interval === "monthly" ? "月" : "年"}</span>
        </div>

        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>

        <Button
          className="w-full"
          variant={isCurrent ? "outline" : "default"}
          disabled={isCurrent}
          onClick={onSelect}
        >
          {isCurrent ? "当前套餐" : "选择套餐"}
        </Button>
      </CardContent>
    </Card>
  );
}
