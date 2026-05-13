import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
}

export function ProgressBar({ value }: ProgressBarProps) {
  const getGradient = () => {
    if (value >= 100) return "from-emerald-500 to-emerald-400";
    if (value >= 60) return "from-primary to-chart-3";
    return "from-primary/70 to-primary/50";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">总体进度</span>
        <span className="font-bold tabular-nums">{value}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out",
            getGradient()
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
