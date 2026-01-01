"use client"

import * as React from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandDialog
} from "@/components/ui/command"
import { ArrowUpDown, MapPin, RouteIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useAppDispatch } from "@/store/hook"
import { setDirectionsData } from "@/store/slices/mapSlice"

type Location = {
  id: string
  name: string
  lat: number
  lng: number
}

type Props = {
  locations?: Location[]
  onGetDirections?: (from: Location, to: Location) => void
}

export default function DirectionsToolbar({
  locations = SAMPLE_LOCATIONS,
  onGetDirections,
}: Props) {
  const [from, setFrom] = React.useState<Location | null>(null)
  const [to, setTo] = React.useState<Location | null>(null)
  const [open, setOpen] = React.useState(false)
    const dispatch = useAppDispatch();
  const swapLocations = () => {
    setFrom(to)
    setTo(from)
  }

  const handleGetDirections = () => {
    if (from && to) {
      onGetDirections?.(from, to)
        dispatch(setDirectionsData({ start: [from.lng, from.lat], end: [to.lng, to.lat] }))
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
        size="sm"
        className="h-6 text-xs bg-background hover:bg-background/60 text-foreground"

      >
        <RouteIcon className="w-3 h-3" />
        Get Directions
      </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[340px] p-3">
        <div className="flex flex-col gap-3">
          {/* FROM */}
          <LocationSelect
            label="From"
            value={from}
            onSelect={setFrom}
            locations={locations}
          />

          <div className="flex justify-center">
            <Button
              size="icon"
              variant="ghost"
              onClick={swapLocations}
              className="rounded-full"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          {/* TO */}
          <LocationSelect
            label="To"
            value={to}
            onSelect={setTo}
            locations={locations}
          />

          <Separator />

          <Button
            disabled={!from || !to}
            onClick={handleGetDirections}
          >
            Show Route
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

/* ---------------- SUB COMPONENT ---------------- */

function LocationSelect({
  label,
  value,
  onSelect,
  locations,
}: {
  label: string
  value: Location | null
  onSelect: (l: Location) => void
  locations: Location[]
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>

      <Command className="rounded-lg border">
        <CommandInput placeholder="Search location..." />
        <CommandEmpty>No location found.</CommandEmpty>

        <CommandGroup>
          {locations.map((loc) => (
            <CommandItem
              key={loc.id}
              onSelect={() => onSelect(loc)}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {loc.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>

      {value && (
        <span className="text-xs text-primary mt-1">
          Selected: {value.name}
        </span>
      )}
    </div>
  )
}

/* ---------------- SAMPLE DATA ---------------- */

const SAMPLE_LOCATIONS: Location[] = [
  {
    id: "1",
    name: "Mumbai",
    lat: 19.076,
    lng: 72.8777,
  },
  {
    id: "2",
    name: "Pune",
    lat: 18.5204,
    lng: 73.8567,
  },
  {
    id: "3",
    name: "Nashik",
    lat: 20.011,
    lng: 73.7903,
  },
]
