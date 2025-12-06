'use client'
import MapRectangleSelector from '@/components/map/map-rectangle-selector'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import React from 'react'

type Props = {}

const CreateGeofenceButton = (props: Props) => {
  const [open, setOpen] = React.useState(false)
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild >
        <DropdownMenuItem className='w-full' onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true) }}>Geofence</DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Geofence</DialogTitle>
          <DialogDescription>
            Create a new geofence and add it to the mission. Geofence can be a rectangle or a circle.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-2'>
          <div className='space-y-1'>
            <MapRectangleSelector onSelect={(lng1, lat1, lng2, lat2) => { console.log(lng1, lat1, lng2, lat2) }} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateGeofenceButton