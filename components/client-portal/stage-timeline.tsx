import { Stage } from "@/lib/types";
import { CheckCircle2, Clock, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StageTimelineProps {
  stages: Stage[];
}

const statusConfig = {
  pending: {
    icon: Circle,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    borderColor: "border-border",
    label: "待开始",
  },
  in_progress: {
    icon: Clock,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
    label: "进行中",
  },
  completed: {
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    label: "已完成",
  },
};

export function StageTimeline({ stages }: StageTimelineProps) {
  return (
    <div className="space-y-0">
      {stages
        .sort((a, b) => a.order - b.order)
        .map((stage, index) => {
          const config = statusConfig[stage.status];
          const StatusIcon = config.icon;
          const isLast = index === stages.length - 1;

          return (
            <div key={stage.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2",
                    config.borderColor,
                    config.bgColor
                  )}
                >
                  <StatusIcon className={cn("h-4 w-4", config.color)} />
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "w-px flex-1 min-h-[2rem]",
                      stage.status === "completed"
                        ? "bg-emerald-500/30"
                        : "bg-border"
                    )}
                  />
                )}
              </div>
              <div className="flex-1 pb-6">
                <div className="flex items-center justify-between">
                  <h4
                    className={cn(
                      "font-medium text-sm",
                      stage.status === "completed" &&
                        "text-muted-foreground line-through"
                    )}
                  >
                    {stage.name}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {stage.status === "completed" && stage.completedDate
                      ? `完成于 ${stage.completedDate}`
                      : stage.expectedDate
                      ? `预计 ${stage.expectedDate}`
                      : ""}
                  </span>
                </div>
                <p className={cn("text-xs mt-0.5", config.color)}>
                  {config.label}
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
}
