import { useId, useState, useEffect } from "react"
import { ClockIcon, CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

type Props = {
  onDateTimeChange: (date: Date) => void
  defaultDate?: Date
  minDate?: Date
  maxDate?: Date
}

export default function DateTimePicker({
  onDateTimeChange,
  defaultDate,
  minDate,
  maxDate,
}: Props) {
  const id = useId()
  const [date, setDate] = useState<Date | undefined>(defaultDate ?? new Date())
  const [time, setTime] = useState<string>(() => {
    const d = defaultDate ?? new Date()
    return d.toTimeString().slice(0, 8) // HH:MM:SS
  })

  // Combine date and time when either changes
  useEffect(() => {
    if (!date) return
    const [hours, minutes, seconds] = time.split(":").map(Number)
    const combined = new Date(date)
    combined.setHours(hours, minutes, seconds, 0)

    // Apply min/max bounds
    if (minDate && combined < minDate) return
    if (maxDate && combined > maxDate) return

    onDateTimeChange(combined)
  }, [date, time])

  // Display formatted value
  const formattedValue = date
    ? `${date.toLocaleDateString()} ${time}`
    : "Select date & time"

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="w-full justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formattedValue}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-2 space-y-3" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (!selectedDate) return
            if (minDate && selectedDate < new Date(minDate.toDateString())) return
            if (maxDate && selectedDate > new Date(maxDate.toDateString())) return
            setDate(selectedDate)
          }}
          fromDate={minDate}
          toDate={maxDate}
        />

        <div className="border-t pt-3">
          <div className="flex items-center gap-3">
            {/* <Label htmlFor={id} className="text-xs">
              Enter time
            </Label> */}
            <div className="relative grow">
              <Input
                id={id}
                type="time"
                step="1"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="peer appearance-none ps-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                <ClockIcon size={16} aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
