import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Asset, Track } from "@/lib/types"
import IconRenderer from "./icon-renderer"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/store/hook"
import { setSidebarData, setSidebarType } from "@/store/slices/sidebarSlice"
import { AwardIcon, StarIcon, VectorSquareIcon } from "lucide-react"

type Props = {
  asset: Asset;
}

export default function AssetPopup({ asset }: Props) {
  if (asset.positions === undefined) return null
  // const classification = asset.classification;
  // const velocity = track.velocity;
  const rotation = asset.positions[0].heading || 0;
  const dispatch = useAppDispatch();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-2 cursor-pointer relative flex">
            <div className='cursor-pointer text-white font-light text-[11px] bg-blue-600 px-1 rounded flex flex-1 items-center gap-1 absolute -top-4 left-4 max-w-40 min-w-20'>
              <AwardIcon className='w-3 h-3 aspect-square' fill="white" />
              <p className="w-full truncate">{asset.title}</p>
            </div>
          <div style={{ transform: `rotate(${rotation}deg)` }} >
            <IconRenderer
              icon={asset.type}
              // color={track.status === "ACTIVE" ? "green-500" : "red-500"}
              color="blue-400"
            />
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80 space-y-2 p-3">

      </PopoverContent>
    </Popover>
  );
}
