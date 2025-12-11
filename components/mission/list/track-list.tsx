import { CommandItem } from '@/components/ui/command'
import { Track } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useAppDispatch } from '@/store/hook'
import { setSidebarData, setSidebarType } from '@/store/slices/sidebarSlice'
import { AlertCircleIcon, AlertOctagon, AlertOctagonIcon, AlertTriangleIcon, BadgeQuestionMark, BadgeQuestionMarkIcon, CarIcon, CheckIcon, DogIcon, DroneIcon, Plane, PlaneIcon, ShieldQuestionMark, ShipIcon, UserIcon } from 'lucide-react'
import React from 'react'

type Props = {
    tracks: Track[]
}

const TrackList = ({ tracks = [] }: Props) => {
    const dispatch = useAppDispatch();


    return (
        <div>
            {tracks.map((track) => (
                <CommandItem key={track.id}
                    onDoubleClick={() => {
                        dispatch(setSidebarType('track'))
                        dispatch(setSidebarData(track))
                    }}
                >
                    <div className={cn('h-4 w-1 rounded ', color(track.status))} />
                    {renderIcon(track,'4')}
                    {(track.trackId).split('-').map((id) => id.charAt(0).toUpperCase() + id.slice(1)).join(' ')}
                    <span className='ml-auto'>
                        {threat(track.threatLevel)}
                    </span>
                </CommandItem>
            ))}
        </div>
    )
}

export default TrackList

export const renderIcon = (track: Track, size?: string) => {
    if (track.type === 'PERSON') {
        return <UserIcon className={`aspect-square h-${size}`} />;
    } else if (track.type === 'VEHICLE') {
        return <CarIcon className={`aspect-square h-${size}`} />
    } else if (track.type === 'ANIMAL') {
        return <DogIcon className={`aspect-square h-${size}`} />
    } else if (track.type === 'UNKNOWN') {
        return <ShieldQuestionMark className={`aspect-square h-${size}`} />
    } else if (track.type === 'AIRCRAFT') {
        return <PlaneIcon className={`aspect-square h-${size}`} />
    } else if (track.type === 'VESSEL') {
        return <ShipIcon className={`aspect-square h-${size}`} />
    } else if (track.type === 'DRONE') {
        return <DroneIcon className={`aspect-square h-${size}`} />
    }
}
const color = (status: string) => {
    switch (status) {
        case "ACTIVE":
            return "bg-green-500";
        case "LOST":
            return "bg-red-500";
        case "TERMINATED":
            return "bg-yellow-500";
        default:
            return "";
    }
}

const threat = (level: string) => {
    switch (level) {
        case "NONE":
            return <BadgeQuestionMarkIcon className="text-muted-foreground h-4 w-4" />;
        case "LOW":
            return <AlertCircleIcon className="text-green-500 h-4 w-4" />;
        case "MEDIUM":
            return <AlertCircleIcon className="text-yellow-500 h-4 w-4" />;
        case "HIGH":
            return <AlertCircleIcon className="text-amber-600 h-4 w-4" />;
        case "CRITICAL":
            return <AlertCircleIcon className="text-red-500 h-4 w-4" />;
        default:
            return "";
    }
}