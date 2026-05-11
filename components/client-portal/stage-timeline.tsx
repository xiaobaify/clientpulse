import { Stage } from "@/lib/types";
import { CheckCircle, Clock, Circle } from "lucide-react";

interface StageTimelineProps {
  stages: Stage[];
}

const statusIcons = {
  pending: Circle,
  in_progress: Clock,
  completed: CheckCircle,
};

const statusColors = {
  pending: "text-muted-foreground",
  in_progress: "text-blue-500",
  completed: "text-green-500",
};

export function StageTimeline({ stages }: StageTimelineProps) {
  return (
    <div className="space-y-4">
      {stages
        .sort((a, b) => a.order - b.order)
        .map((stage, index) => {
          const StatusIcon = statusIcons[stage.status];
          const isLast = index === stages.length - 1;

          return (
            <div key={stage.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <StatusIcon
                  className={`h-6 w-6 ${statusColors[stage.status]}`}
                />
                {!isLast && (
                  <div className="w-px h-full bg-border min-h-[2rem]" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{stage.name}</h4>
                  <span className="text-sm text-muted-foreground">
                    {stage.status === "completed" && stage.completedDate
                      ? `完成于 ${stage.completedDate}`
                      : stage.expectedDate
                      ? `预计 ${stage.expectedDate}`
                      : ""}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {stage.status === "completed"
                    ? "已完成"
                    : stage.status === "in_progress"
                    ? "进行中"
                    : "待开始"}
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
}
