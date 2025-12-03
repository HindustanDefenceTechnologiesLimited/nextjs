import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Track } from '@/lib/types'
import { PlaneIcon } from 'lucide-react'
import IconRenderer from './icon-renderer'
type Props = {
    track: Track;
}

const TrackPopup = ({track}: Props) => {
    useEffect(() => {
        // console.log("Hello");
    }, [])
  return (
    <Popover>
      <PopoverTrigger asChild>
          <button className="p-2 cursor-pointer">
            <p className='bg-foreground px-1 rounded text-background'>{track.trackId}</p>
            <IconRenderer icon={track.type} color={track.status === 'ACTIVE' ? 'green-500' : 'red-500'} />
          </button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        {JSON.stringify(track)}
      </PopoverContent>
    </Popover>
  )
}

export default TrackPopup


