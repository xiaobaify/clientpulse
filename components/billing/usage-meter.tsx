import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UsageMeterProps {
  title: string;
  used: number;
  total: number;
  unit: string;
}

export function UsageMeter({ title, used, total, unit }: UsageMeterProps) {
  const percentage = total === -1 ? 0 : Math.round((used / total) * 100);
  const isUnlimited = total === -1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>
            {used} {unit}
          </span>
          <span className="text-muted-foreground">
            {isUnlimited ? "无限" : `/ ${total} ${unit}`}
          </span>
        </div>
        {!isUnlimited && (
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className={`h-full rounded-full ${
                percentage > 80 ? "bg-yellow-500" : "bg-primary"
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
