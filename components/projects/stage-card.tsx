"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stage } from "@/lib/types";
import { GripVertical, CheckCircle, Clock, Circle } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface StageCardProps {
  stage: Stage;
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

const statusLabels = {
  pending: "待开始",
  in_progress: "进行中",
  completed: "已完成",
};

export function StageCard({ stage }: StageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stage.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const StatusIcon = statusIcons[stage.status];

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={isDragging ? "ring-2 ring-primary" : ""}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <button {...attributes} {...listeners} className="cursor-grab">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>
            <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
          </div>
          <StatusIcon className={`h-4 w-4 ${statusColors[stage.status]}`} />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge variant="outline">{statusLabels[stage.status]}</Badge>
            {stage.expectedDate && (
              <span className="text-xs text-muted-foreground">
                预计 {stage.expectedDate}
              </span>
            )}
          </div>
          {stage.files.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              {stage.files.length} 个文件
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
