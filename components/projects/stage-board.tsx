"use client";

import { Stage } from "@/lib/types";
import { StageCard } from "./stage-card";
import { updateStageOrder } from "@/lib/api";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

interface StageBoardProps {
  stages: Stage[];
  projectId?: string;
}

export function StageBoard({ stages: initialStages, projectId }: StageBoardProps) {
  const [stages, setStages] = useState(initialStages);
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setStages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over!.id);
        const newItems = arrayMove(items, oldIndex, newIndex).map(
          (item, index) => ({ ...item, order: index })
        );

        // Persist to database
        if (projectId) {
          startTransition(async () => {
            try {
              await updateStageOrder(
                newItems.map((s) => ({ id: s.id, sort_order: s.order }))
              );
            } catch (err) {
              console.error("Failed to persist stage order:", err);
            }
          });
        }

        return newItems;
      });
    }
  }

  return (
    <div className="relative">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={stages} strategy={horizontalListSortingStrategy}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[...stages]
              .sort((a, b) => a.order - b.order)
              .map((stage) => (
                <div key={stage.id} className="w-48 flex-shrink-0">
                  <StageCard stage={stage} />
                </div>
              ))}
          </div>
        </SortableContext>
      </DndContext>
      {isPending && (
        <div className="absolute top-2 right-2 flex items-center gap-1.5 rounded-md bg-background/80 px-2 py-1 text-xs text-muted-foreground backdrop-blur-sm">
          <Loader2 className="h-3 w-3 animate-spin" />
          保存中...
        </div>
      )}
    </div>
  );
}
