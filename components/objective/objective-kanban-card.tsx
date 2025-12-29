// components/objective/objective-kanban-card.tsx
import { Objective } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import AssignAsset from "./assign-asset";
import { KanbanItemHandle } from "../ui/kanban";
import React from "react";

export const ObjectiveCard = React.memo(
  ({ objective, className }: { objective: Objective; className?: string }) => {
    return (
      <div className={cn("rounded-md border bg-card p-3 shadow-xs", className)}>
        <div className="flex flex-col gap-2">
          {/* Title + Type */}
          <KanbanItemHandle className="flex flex-col gap-2 items-start w-full ">
            <div className="w-full flex items-start justify-between gap-2">
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

            {objective.description && (
              <p className="text-xs text-muted-foreground line-clamp-1 truncate w-full text-start">
                {objective.description}
              </p>
            )}
          </KanbanItemHandle>
          <div className="flex items-center gap-2 justify-between">
            {objective.allocations?.length ? (
              <div className="flex flex-wrap gap-1">
                {objective.allocations.map((alloc) => {
                  console.log(alloc);
                  return (
                    <Badge
                      key={alloc.id}
                      variant="secondary"
                      className="text-[10px] rounded-sm"
                    >
                      {alloc.asset?.title ?? alloc.assetId}
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <span className="text-[10px] text-muted-foreground">
                No assets assigned
              </span>
            )}
            <AssignAsset
              objectiveId={objective.id}
              allocations={objective.allocations || []}
            />{" "}
          </div>
        </div>
      </div>
    );
  }
);
