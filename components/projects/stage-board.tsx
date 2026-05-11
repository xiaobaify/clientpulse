"use client";

import { Stage } from "@/lib/types";
import { StageCard } from "./stage-card";
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
import { useState } from "react";

interface StageBoardProps {
  stages: Stage[];
  onReorder?: (stages: Stage[]) => void;
}

export function StageBoard({ stages: initialStages, onReorder }: StageBoardProps) {
  const [stages, setStages] = useState(initialStages);

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
        onReorder?.(newItems);
        return newItems;
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={stages} strategy={horizontalListSortingStrategy}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages
            .sort((a, b) => a.order - b.order)
            .map((stage) => (
              <div key={stage.id} className="w-48 flex-shrink-0">
                <StageCard stage={stage} />
              </div>
            ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
