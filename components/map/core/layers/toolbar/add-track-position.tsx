"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { RootState } from "@/store/store"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { useMap } from "../../map-context"
import { toast } from "sonner"
import api from "@/lib/auth"
import { TrackPosition } from "@/lib/types"
import { updateTrack } from "@/store/slices/missionSlice"

export default function AddTrackPosition({
    addElementClicked, setAddElementClicked
}: {
    addElementClicked: boolean,
    setAddElementClicked: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const mission = useAppSelector((state: RootState) => state.mission.data);
    const tracks = mission.tracks || [];
    const map = useMap();
    const dispatch = useAppDispatch()
    const onTrackSelect = (id: string, trackId: string, positions: TrackPosition[]) => {
        setValue(id);
        setAddElementClicked(true);
        map.getCanvas().style.cursor = 'crosshair';
        toast.loading('Click on the map to add an track position for ' + trackId, {
            id: 'add-' + id,
        });
        map?.once("click", async (e) => {
            const { lng, lat } = e.lngLat;
            map.getCanvas().style.removeProperty('cursor');
            toast.dismiss('add-' + id)
            console.log(lng, lat);
            try {
                const res = await api.post(`/api/trackpositions/create`, {
                    longitude: lng,
                    latitude: lat,
                    timestamp: new Date(),
                    trackId: id
                });
                if (res.data.success) toast.success('Position added successfully!');
                const oldPositions = positions;
                dispatch(updateTrack({ id: id, positions: [res.data.data, ...oldPositions] }))
            } catch (error) {
                toast.error("Failed to add position");
            } finally {
                setValue('');
                setAddElementClicked(false);
            }
            return
        })
        setAddElementClicked(false);
        return
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    disabled={addElementClicked}
                    size="sm"
                    className="h-6 text-xs bg-background hover:bg-background/60 text-foreground"
                >
                    <PlusIcon className="w-3 h-3" />
                    Track position
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search track..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No track found.</CommandEmpty>
                        <CommandGroup>
                            {tracks.map((track) => (
                                <CommandItem
                                    key={track.id}
                                    value={track.id}
                                    onSelect={(currentValue) => {
                                        onTrackSelect(currentValue, track.trackId, track.positions || []);
                                        setOpen(false);
                                    }}
                                >
                                    {track.trackId}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === track.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
