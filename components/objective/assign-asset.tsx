// components/objective/assign-asset.tsx
import React, { useCallback, useMemo, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserPlus2Icon, XIcon } from "lucide-react";
import { Asset, ObjectiveAllocation } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { RootState } from "@/store/store";
import api from "@/lib/auth";
import { updateObjective } from "@/store/slices/missionSlice";
import { toast } from "sonner";

type Props = {
    objectiveId: string;
    allocations: ObjectiveAllocation[];
};

const AssignAsset = ({ objectiveId, allocations }: Props) => {

    const dispatch = useAppDispatch();

    const missionAssets =
        useAppSelector((state: RootState) => state.mission.data?.assets) ?? [];

    const selectedAssets = useMemo(
        () => allocations.map(a => a.asset as Asset),
        [allocations]
    );

const unSelectedAssets = useMemo(() => {
    const selectedIds = new Set(allocations.map(a => a.assetId));
    return missionAssets.filter(asset => !selectedIds.has(asset.id));
}, [missionAssets, allocations]);

    /* ---------------------------------
       Handlers
    ---------------------------------- */
const addAsset = useCallback(
  async (asset: Asset) => {
    try {
      const res = await api.post(`/api/objective/assign`, {
        objectiveId,
        assetId: asset.id,
      });

      if (res.data.success) {
        dispatch(
          updateObjective({
            id: objectiveId,
            allocations: [...allocations, res.data.data],
          })
        );
        toast.success("Asset assigned successfully!");
      }
    } catch {
      toast.error("Failed to assign asset");
    }
  },
  [objectiveId, allocations, dispatch]
);

const removeAsset = useCallback(
  async (assetId: string) => {
    try {
      const res = await api.post(`/api/objective/unassign`, {
        objectiveId,
        assetId,
      });

      if (res.data.success) {
        dispatch(
          updateObjective({
            id: objectiveId,
            allocations: allocations.filter(a => a.assetId !== assetId),
          })
        );
        toast.success("Asset unassigned successfully!");
      }
    } catch {
      toast.error("Failed to unassign asset");
    }
  },
  [objectiveId, allocations, dispatch]
);



    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="icon-sm" variant="secondary" className="pointer-events-auto">
                    <UserPlus2Icon className="size-3" />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign Asset</DialogTitle>
                    <DialogDescription>
                        Assign assets to this objective
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Asset Picker */}
                    <div className="space-y-2">
                        <Label>Select Asset</Label>
                        <Command className="max-h-80">
                            <CommandInput placeholder="Search asset by title..." />
                            <CommandList>
                                <CommandGroup heading="Assets">
                                    <CommandEmpty>No assets found.</CommandEmpty>
                                    {unSelectedAssets.map(asset => (
                                        <CommandItem
                                            key={asset.id}
                                            onSelect={() => addAsset(asset)}
                                        >
                                            <UserPlus2Icon className="size-3 mr-2" />
                                            {asset.title}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </div>

                    {/* Selected Assets */}
                    <div className="space-y-2">
                        <Label>Selected Assets</Label>
                        <div className="space-y-2 max-h-52 overflow-y-auto">
                            {selectedAssets.length === 0 && (
                                <span className="text-muted-foreground">
                                    No assets selected.
                                </span>
                            )}

                            {selectedAssets.map(asset => (
                                <div
                                    key={asset.id}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <UserPlus2Icon className="size-3" />
                                        <span>{asset.title}</span>
                                    </div>
                                    <Button
                                        size="icon-sm"
                                        variant="destructive"
                                        onClick={() => removeAsset(asset.id)}
                                    >
                                        <XIcon className="size-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    {/* <div className="flex justify-end">
            <Button onClick={handleSave}>Save</Button>
          </div> */}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AssignAsset;
