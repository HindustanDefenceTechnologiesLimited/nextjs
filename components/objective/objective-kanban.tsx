"use client";

import * as React from "react";
import { Kanban, KanbanBoard, KanbanColumn, KanbanItem, KanbanOverlay, } from "@/components/ui/kanban";
import { Badge } from "@/components/ui/badge";
import { Objective, ObjectiveStatus, } from "@/lib/types";
import api from "@/lib/auth";
import { useAppDispatch } from "@/store/hook";
import { updateObjective } from "@/store/slices/missionSlice";
import { cn } from "@/lib/utils";
import CreateObjective from "./create-objective";

export const OBJECTIVE_COLUMNS: {
  value: ObjectiveStatus;
  title: string;
}[] = [
    { value: ObjectiveStatus.NEW, title: "New" },
    { value: ObjectiveStatus.IN_PROGRESS, title: "In Progress" },
    { value: ObjectiveStatus.COMPLETED, title: "Completed" },
    { value: ObjectiveStatus.FAILED, title: "Failed" },
  ];
type Props = {
  objectives: Objective[];
};

export default function ObjectiveKanban({ objectives }: Props) {

  const [columns, setColumns] = React.useState<
    Record<ObjectiveStatus, Objective[]>
  >(() => buildColumns(objectives));
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    setColumns(buildColumns(objectives));
  }, [objectives]);
  function buildColumns(objectives: Objective[]) {
    return OBJECTIVE_COLUMNS.reduce((acc, col) => {
      acc[col.value] = objectives.filter(
        (obj) => obj.status === col.value
      );
      return acc;
    }, {} as Record<ObjectiveStatus, Objective[]>);
  }

  function buildStatusMap(
    cols: Record<ObjectiveStatus, Objective[]>
  ) {
    const map = new Map<string, ObjectiveStatus>();

    for (const [status, items] of Object.entries(cols)) {
      for (const item of items) {
        map.set(item.id, status as ObjectiveStatus);
      }
    }

    return map;
  }
  const handleStatusChange = async (
    newColumns: Record<ObjectiveStatus, Objective[]>
  ) => {
    const oldStatusMap = buildStatusMap(columns);
    const newStatusMap = buildStatusMap(newColumns);

    let changed:
      | {
        id: string;
        from: ObjectiveStatus;
        to: ObjectiveStatus;
      }
      | null = null;

    for (const [id, newStatus] of newStatusMap.entries()) {
      const oldStatus = oldStatusMap.get(id);

      if (oldStatus && oldStatus !== newStatus) {
        changed = {
          id,
          from: oldStatus,
          to: newStatus,
        };
        break;
      }
    }

    if (changed) {
      try {
        const res = await api.put(`/api/objective/update/${changed.id}`, { status: changed.to });
        if (res.status === 201) {
          dispatch(updateObjective({ id: changed.id, status: changed.to }));
        }
      } catch (error) {

      }

    }

    setColumns(newColumns);
  };


  return (
    <Kanban
      value={columns}
      onValueChange={handleStatusChange}
      getItemValue={(item) => item.id}
    >
      <KanbanBoard className="flex flex-col gap-2 pr-2">
        <div className="grid auto-rows-fr sm:grid-cols-5 gap-2 h-[70vh]">
          {OBJECTIVE_COLUMNS.map(({ value, title }) => {
            const items = columns[value] ?? [];
            if (title == 'Failed' || title == 'Completed') return null;
            return (
              <KanbanColumn key={value} value={value} className="h-[70vh] col-span-2">
                {/* Column Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold truncate">
                      {title}
                    </span>
                    <Badge variant="secondary" className="rounded-sm">
                      {items.length}
                    </Badge>
                  </div>
                  <CreateObjective defaultStatus={value} />
                </div>
                {/* Column Items */}
                <div className="flex flex-col gap-2 p-0.5 h-[65vh] overflow-y-auto ">
                  {items.map((objective) => (
                    <KanbanItem
                      key={objective.id}
                      value={objective.id}
                      asHandle
                    // asChild
                    >
                      <ObjectiveCard objective={objective} />
                    </KanbanItem>
                  ))}
                </div>
              </KanbanColumn>
            );
          })}
          <KanbanColumn value={ObjectiveStatus.COMPLETED} className="h-[70vh]">
            {/* Column Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold truncate">
                  Completed
                </span>
                <Badge variant="secondary" className="rounded-sm">
                  {columns[ObjectiveStatus.COMPLETED]?.length}
                </Badge>
              </div>
            </div>
            {/* Column Items */}
            <div className="flex flex-col gap-2 p-0.5 h-[65vh] overflow-y-auto ">
              {columns[ObjectiveStatus.COMPLETED]?.map((objective) => (
                <KanbanItem
                  key={objective.id}
                  value={objective.id}
                  asHandle
                // asChild
                >
                  <ObjectiveCard objective={objective} />
                </KanbanItem>
              ))}
            </div>
          </KanbanColumn>
        </div>
        <div>
          <KanbanColumn value={ObjectiveStatus.FAILED} className="border-secondary-2 border-dashed">
            {/* Column Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  Failed
                </span>
                <Badge variant="secondary" className="rounded-sm">
                  {columns[ObjectiveStatus.FAILED]?.length}
                </Badge>
              </div>
            </div>

            {/* Column Items */}
            <div className="flex gap-2 p-0.5 w-[74vw] overflow-x-auto">
              {columns[ObjectiveStatus.FAILED]?.map((objective) => (
                <KanbanItem
                  key={objective.id}
                  value={objective.id}
                  asHandle
                // asChild
                >
                  <ObjectiveCard objective={objective} className="max-w-50 min-w-50" />
                </KanbanItem>
              ))}
            </div>
          </KanbanColumn>

        </div>
      </KanbanBoard>

      <KanbanOverlay>
        <div className="size-full rounded-md bg-primary/10" />
      </KanbanOverlay>
    </Kanban>
  );
}


const ObjectiveCard = ({ objective, className }: { objective: Objective, className?: string }) => {
  return (
    <div className={cn("rounded-md border bg-card p-3 shadow-xs", className)}>
      <div className="flex flex-col gap-2">
        {/* Title + Type */}
        <div className="flex items-start justify-between gap-2">
          <span className="line-clamp-2 text-sm font-medium truncate">
            {objective.title}
          </span>
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 rounded-sm"
          >
            {objective.type.replaceAll("_", " ")}
          </Badge>
        </div>

        {/* Description */}
        {objective.description && (
          <p className="text-xs text-muted-foreground line-clamp-1 truncate">
            {objective.description}
          </p>
        )}

        {/* Assigned Assets */}
        {objective.allocations?.length ? (
          <div className="flex flex-wrap gap-1">
            {objective.allocations.map((alloc) => (
              <Badge
                key={alloc.id}
                variant="secondary"
                className="text-[10px] rounded-sm"
              >
                {alloc.asset?.title ?? alloc.assetId}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-[10px] text-muted-foreground">
            No assets assigned
          </span>
        )}
      </div>
    </div>
  )
}