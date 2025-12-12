import { Button } from '@/components/ui/button'
import { CommandItem } from '@/components/ui/command'
import { Geofence, Track } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useAppDispatch } from '@/store/hook'
import { setMapData, setMapType } from '@/store/slices/mapSlice'
import { setSidebarData, setSidebarType } from '@/store/slices/sidebarSlice'
import { AlertCircleIcon, AlertOctagon, AlertOctagonIcon, AlertTriangleIcon, BadgeQuestionMark, BadgeQuestionMarkIcon, CarIcon, CheckIcon, CircleIcon, DogIcon, DroneIcon, MapPin, MapPinIcon, Plane, PlaneIcon, RectangleHorizontalIcon, ShieldQuestionMark, ShipIcon, UserIcon } from 'lucide-react'
import React from 'react'

type Props = {
    geofences: Geofence[]
}

const GeofenceList = ({ geofences = [] }: Props) => {
    const dispatch = useAppDispatch();
    return (
        <div>
            {geofences.map((geofence) => (
                <CommandItem key={geofence.id}
                    className='cursor-pointer group'

                >
                    {renderIcon(geofence.geometry.shapeType)}
                    {geofence.name}
                    <span className='hidden'>{geofence.id}</span>
                    <span className='ml-auto'>
                        <Button size='icon-sm' variant='ghost' className='h-6 w-6 opacity-0 group-hover:opacity-100'
                            onClick={() => {
                                dispatch(setMapType('geofence'));
                                dispatch(setMapData(geofence))
                            }}>
                            <MapPinIcon className='w-4 h-4' />
                        </Button>
                    </span>
                </CommandItem>
            ))}
        </div>
    )
}

export default GeofenceList

export const renderIcon = (shape: 'circle' | 'rectangle') => {
    if (shape === 'circle') {
        return <CircleIcon className=" h-4 w-4" />;
    } else if (shape === 'rectangle') {
        return <RectangleHorizontalIcon className=" h-4 w-4" />
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