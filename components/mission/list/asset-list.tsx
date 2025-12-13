import { Button } from '@/components/ui/button'
import { CommandItem } from '@/components/ui/command'
import { Asset, Track } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useAppDispatch } from '@/store/hook'
import { setMapData, setMapType } from '@/store/slices/mapSlice'
import { setSidebarData, setSidebarType } from '@/store/slices/sidebarSlice'
import { AlertCircleIcon, AlertOctagon, AlertOctagonIcon, AlertTriangleIcon, BadgeQuestionMark, BadgeQuestionMarkIcon, CarIcon, Check, CheckIcon, DogIcon, DroneIcon, MapPinIcon, Plane, PlaneIcon, ShieldQuestionMark, ShipIcon, UserIcon } from 'lucide-react'
import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
type Props = {
    assets: Asset[]
}

const AssetList = ({ assets = [] }: Props) => {
    const dispatch = useAppDispatch();


    return (
        <div>
            {assets.map((asset) => (
                <CommandItem key={asset.id}
                    onSelect={(e) => {
                        dispatch(setSidebarType('asset'))
                        dispatch(setSidebarData(asset))
                    }}
                    className='cursor-pointer group'

                >
                    {asset.title}
                    <Button size='icon-sm' variant='ghost' className='h-6 w-6 ml-auto opacity-0 group-hover:opacity-100'
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setMapType('asset'));
                            dispatch(setMapData(asset))
                        }}>
                        <MapPinIcon className='w-4 h-4' />
                    </Button>
                    <span >
                        <Tooltip >
                            <TooltipTrigger asChild>
                                <p>
                                {status(asset.status)}
                                </p>
                            </TooltipTrigger>
                            <TooltipContent side='right' >
                                <p>{asset.status}</p>
                            </TooltipContent>
                        </Tooltip>
                    </span>
                </CommandItem>
            ))}
        </div>
    )
}

export default AssetList

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

const status = (status: string) => {
    switch (status) {
        case "NONE":
            return <BadgeQuestionMarkIcon className="text-muted-foreground h-4 w-4" />;
        case "AVAILABLE":
            return <CheckIcon className="text-green-500 h-4 w-4" />;
        case "DEPLOYED":
            return <CheckIcon className="text-yellow-500 h-4 w-4" />;
        case "MAINTENANCE":
            return <AlertCircleIcon className="text-blue-600 h-4 w-4" />;
        case "OFFLINE":
            return <AlertCircleIcon className="text-red-500 h-4 w-4" />;
        default:
            return "";
    }
}