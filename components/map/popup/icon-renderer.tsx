import { TrackType } from "@/lib/types"
import { CarIcon, DroneIcon, PlaneIcon, User2Icon } from "lucide-react"

export default function IconRenderer({ icon, color }: { icon: TrackType, color: string }) {
    switch (icon) {
        // case 'AIRCRAFT':
        //     return <img src="/icons/plane.svg" className="w-10" alt="Aircraft" />
        case 'AIRCRAFT':
            return <PlaneIcon className={`h-10 w-10 -rotate-45 text-${color}`} strokeWidth={1.5} />
        case 'DRONE':
            return <DroneIcon className={`h-10 w-10  text-${color}`} strokeWidth={1.5} />
        case 'VEHICLE':
            return <CarIcon className={`h-10 w-10 -rotate-90 text-${color}`} strokeWidth={1.5} />
        case 'PERSON':
            return <User2Icon className={`h-10 w-10 text-${color}`} strokeWidth={1.5} />
        default:
            return null
    }
}