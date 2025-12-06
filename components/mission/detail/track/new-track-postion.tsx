import MapLocationSelector from "@/components/map/map-location-selector"
import { Button } from "@/components/ui/button"
import DateTimePicker from "@/components/ui/date-time-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import api from "@/lib/auth"
import { Track, TrackPosition } from "@/lib/types"
import { useAppDispatch } from "@/store/hook"
import { updateTrack } from "@/store/slices/missionSlice"
import { PlusIcon } from "lucide-react"
import React from "react"
import { toast } from "sonner"

type Props = {
    track: Track,
    onCreate: (trackPosition: TrackPosition) => void
}

const NewTrackPosition = ({ track, onCreate }: Props) => {
    const [form, setForm] = React.useState({
        longitude: 0,
        latitude: 0,
        timestamp: new Date(),
    })
    const dispatch = useAppDispatch();
    const handleAddPosition = async () => {
        try {
            const res = await api.post(`/api/trackpositions/create`, {
                longitude: form.longitude,
                latitude: form.latitude,
                timestamp: form.timestamp,
                trackId: track.id
            })
            if (res.data.success) toast.success('Position added successfully!')
            const oldPositions = track.positions || []
            dispatch(updateTrack({ id: track.id, positions: [...oldPositions, res.data.data] }))
            onCreate(res.data.data);
            console.log(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="" size='sm'>
                    <PlusIcon className="h-4 w-4" />Track Pos.
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-2xl" side="right">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="leading-none font-medium">New Position</h4>
                        <p className="text-muted-foreground text-sm">
                            Set new position for the track.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <MapLocationSelector
                            onSelect={(lng, lat) => {
                                setForm((prev) => ({ ...prev, longitude: lng, latitude: lat }))
                            }}
                        />
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="longitude">Longitude</Label>
                            <Input
                                id="longitude"
                                value={form.longitude}
                                onChange={(e) => setForm({ ...form, longitude: Number(e.target.value) })}
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="latitude">Latitude</Label>
                            <Input
                                id="latitude"
                                value={form.latitude}
                                onChange={(e) => setForm({ ...form, latitude: Number(e.target.value) })}
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="timestamp">Timestamp</Label>
                            <DateTimePicker
                                onDateTimeChange={(date) => setForm({ ...form, timestamp: date })}
                                defaultDate={new Date()}
                            />
                        </div>
                    </div>
                    <Button className="ml-auto" onClick={handleAddPosition}>Save</Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default NewTrackPosition