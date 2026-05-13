import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface UsageMeterProps {
  title: string;
  used: number;
  total: number;
  unit: string;
}

export function UsageMeter({ title, used, total, unit }: UsageMeterProps) {
  const percentage = total === -1 ? 0 : Math.round((used / total) * 100);
  const isUnlimited = total === -1;

  const getBarColor = () => {
    if (percentage > 90) return "bg-destructive";
    if (percentage > 70) return "bg-amber-500";
    return "bg-primary";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold tracking-tight">{used}</span>
          <span className="text-sm text-muted-foreground">
            {isUnlimited ? "无限" : `/ ${total} ${unit}`}
          </span>
        </div>
        {!isUnlimited && (
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-all", getBarColor())}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        )}
        {isUnlimited && (
          <p className="text-xs text-muted-foreground">无限制</p>
        )}
      </CardContent>
    </Card>
  );
}
