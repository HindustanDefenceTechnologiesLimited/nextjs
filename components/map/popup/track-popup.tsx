import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Track } from "@/lib/types"
import IconRenderer from "./icon-renderer"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/store/hook"
import { setSidebarData, setSidebarType } from "@/store/slices/sidebarSlice"

type Props = {
  track: Track;
}

export default function TrackPopup({ track }: Props) {
  if (track.positions === undefined) return null
  const classification = track.classification;
  const velocity = track.velocity;
  const rotation = track.positions[0].heading || 0;
  const dispatch = useAppDispatch();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-2 cursor-pointer relative">
          <p className="flex bg-gray-100 text-xs text-gray-900 gap-1 rounded absolute -top-4 left-4 pr-2 text-start truncate -z-2">
            <span className={cn('w-2',{
              "bg-green-600": track.threatLevel === "NONE",
              "bg-yellow-500": track.threatLevel === "LOW",
              "bg-orange-500": track.threatLevel === "MEDIUM",
              "bg-red-600": track.threatLevel === "HIGH",
              "bg-purple-700": track.threatLevel === "CRITICAL",
            })}/>
            {track.trackId}
          </p>
          <div style={{ transform: `rotate(${rotation}deg)` }}>
            <IconRenderer
              icon={track.type}
              // color={track.status === "ACTIVE" ? "green-500" : "red-500"}
              color="blue-400"
            />
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80 space-y-2 p-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant='secondary' size='sm'
            onClick={() => {
              dispatch(setSidebarType('track'))
              dispatch(setSidebarData(track))
            }}
          >
          Edit track
          </Button>
          <div className="flex gap-1"> 
          <Badge>{track.type}</Badge>
          <Badge
            className={cn({
              "bg-green-600": track.threatLevel === "NONE",
              "bg-yellow-500": track.threatLevel === "LOW",
              "bg-orange-500": track.threatLevel === "MEDIUM",
              "bg-red-600": track.threatLevel === "HIGH",
              "bg-purple-700": track.threatLevel === "CRITICAL",
            })}
          >
            {track.threatLevel}
          </Badge>
          </div>
        </div>

        <Separator />

        {/* Compact Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="font-medium">{track.status}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Mission</p>
            <p className="font-medium truncate">{track.missionId}</p>
          </div>

          <div>
            <p className="text-muted-foreground">First Seen</p>
            <p className="font-medium truncate">{track.firstSeenAt}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Last Seen</p>
            <p className="font-medium truncate">{track.lastSeenAt}</p>
          </div>

          {velocity && (
            <>
              <div>
                <p className="text-muted-foreground">Speed</p>
                <p className="font-medium">{velocity.speed} km/h</p>
              </div>
              <div>
                <p className="text-muted-foreground">Heading</p>
                <p className="font-medium">{velocity.heading}°</p>
              </div>
              {velocity.altitude !== undefined && (
                <div>
                  <p className="text-muted-foreground">Altitude</p>
                  <p className="font-medium">{velocity.altitude} m</p>
                </div>
              )}
            </>
          )}

          {classification && (
            <>
              {classification.subType && (
                <div>
                  <p className="text-muted-foreground">Subtype</p>
                  <p className="font-medium truncate">{classification.subType}</p>
                </div>
              )}

              {classification.color && (
                <div>
                  <p className="text-muted-foreground">Color</p>
                  <p className="font-medium">{classification.color}</p>
                </div>
              )}
            </>
          )}
        </div>

        {track.description && (
          <>
            <Separator />
            <p className="text-xs text-muted-foreground">{track.description}</p>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
