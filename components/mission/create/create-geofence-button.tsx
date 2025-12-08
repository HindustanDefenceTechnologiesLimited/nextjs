'use client'
import MapRectangleSelector from '@/components/map/map-rectangle-selector'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import React from 'react'
import { Alert, AlertDescription, AlertTitle, } from "@/components/ui/alert"
import { AlertCircleIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreateGeofenceDto, GeofenceType } from '@/lib/types'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem, } from '@/components/ui/radio-group'
import MapCircleSelector from '@/components/map/map-circle-selector'
import api from '@/lib/auth'
import { toast } from 'sonner'

const CreateGeofenceButton = () => {
  const mission = useSelector((state: RootState) => state.mission.data);
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [form, setForm] = React.useState<CreateGeofenceDto>(
    {
      name: '',
      geometry: {
        shapeType: 'rectangle',
        coordinates: [[]]
      },
      type: GeofenceType.INCLUSION,
      radius: 0,
      altitude: 0,
      missionId: mission?.id ?? '',
      isActive: true,
      description: ''
    })
  const handleSubmit = async () => {
    if (!form.name || !form.type || !form.geometry.coordinates) {
      toast.error('Please fill in all required fields.');
      return;
    }
    console.log(form);
    setLoading(true);
    try {
      const res = await api.post('/api/geofence/create', form);
      console.log(res);
      if (res.status === 201) {
        toast.success('Geofence created successfully.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  const handleShapeTypeSelect = (shapeType: 'circle' | 'rectangle') => {
    if (shapeType === 'circle') setForm((prev) => ({ ...prev, geometry: { ...prev.geometry, shapeType: shapeType, radius: 0, coordinates: [] } }))
    else if (shapeType === 'rectangle') setForm((prev) => ({ ...prev, geometry: { ...prev.geometry, shapeType: shapeType, radius: undefined, coordinates: [] } }))
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild >
        <DropdownMenuItem className='w-full' onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true) }}>Geofence</DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className='min-w-[70vw] max-h-[90vh] overflow-y-auto pb-0 '>
        <DialogHeader>
          <DialogTitle>Create Geofence</DialogTitle>
        </DialogHeader>
        <div className='space-y-2 relative '>
          <div className='flex gap-2 w-full'>
            <div className='space-y-2 w-full'>
              <Label>Name</Label>
              <Input placeholder='Name' className='w-full'
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className='space-y-2 w-full'>
              <Label>Shape Type</Label>
              <Select defaultValue="rectangle" onValueChange={handleShapeTypeSelect}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Shape Type" className='w-full' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Shape Type</SelectLabel>
                    <SelectItem value="rectangle">Rectangle</SelectItem>
                    <SelectItem value="circle">Circle</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

          </div>
          <div className='space-y-2'>
            <Label>Geofence Type</Label>
            <RadioGroup defaultValue="r-1" className='grid grid-cols-3' onValueChange={(value: GeofenceType) => setForm((prev) => ({ ...prev, type: value }))}>
              <Label className="flex items-start col-span-1 gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
                <RadioGroupItem value="INCLUSION" />
                <div className="flex flex-col gap-1">
                  <p className="text-sm leading-4">Inclusion</p>
                  <p className="text-muted-foreground text-xs">
                    Triggers an event when an track or asset enters the geofence.
                  </p>
                </div>
              </Label>
              <Label className="flex items-start col-span-1 gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
                <RadioGroupItem value="EXCLUSION" />
                <div className="flex flex-col gap-1">
                  <p className="text-sm leading-4">Exclusion</p>
                  <p className="text-muted-foreground text-xs">
                    Triggers an event when an track or asset leaves the geofence.
                  </p>
                </div>
              </Label>
              <Label className="flex items-start col-span-1 gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
                <RadioGroupItem value="ALERT_ZONE" />
                <div className="flex flex-col gap-1">
                  <p className="text-sm leading-4">Alert Zone</p>
                  <p className="text-muted-foreground text-xs">
                    Triggers an alert when an track or asset enters or leaves the geofence.
                  </p>
                </div>
              </Label>
              <Label className="flex items-start col-span-1 gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
                <RadioGroupItem value="SAFE_ZONE" />
                <div className="flex flex-col gap-1">
                  <p className="text-sm leading-4">Safe Zone</p>
                  <p className="text-muted-foreground text-xs">
                    No triggers, just a visual representation of the geofence with green color.
                  </p>
                </div>
              </Label>
              <Label className="flex items-start col-span-1 gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
                <RadioGroupItem value="RESTRICTED_ZONE" />
                <div className="flex flex-col gap-1">
                  <p className="text-sm leading-4">Restricted Zone</p>
                  <p className="text-muted-foreground text-xs">
                    No triggers, just a visual representation of the geofence with red color.
                  </p>
                </div>
              </Label>

            </RadioGroup>

          </div>
          {
            form.geometry.shapeType === 'rectangle' ?
              <div className='space-y-2'>
                <Label>Rectangle</Label>
                <Alert variant="default">
                  <AlertCircleIcon />
                  <AlertTitle>How to select a rectangle?</AlertTitle>
                  <AlertDescription>
                    <ul className="list-inside list-disc text-sm">
                      <li>First select the north-east corner, then the south-west corner.</li>
                      <li>Second corner choice should be on the right and bottom of the first corner.</li>
                      <li>To reset the selection, click on the refresh button.</li>
                    </ul>
                  </AlertDescription>
                </Alert>
                <MapRectangleSelector onSelect={(lng1, lat1, lng2, lat2) => { setForm({ ...form, geometry: { ...form.geometry, shapeType: 'rectangle', coordinates: [[lng1, lat1], [lng2, lat2]] } }) }} />
              </div> :
              <div className='space-y-2'>
                <Label>Circle</Label>
                <Alert variant="default">
                  <AlertCircleIcon />
                  <AlertTitle>How to select a circle?</AlertTitle>
                  <AlertDescription>
                    <ul className="list-inside list-disc text-sm">
                      <li>First select the center, then select a point on the perimeter of the circle. </li>
                    </ul>
                  </AlertDescription>
                </Alert>
                <MapCircleSelector onSelect={(lng, lat, radius) => { setForm({ ...form, geometry: { ...form.geometry, shapeType: 'circle', coordinates: [[lng, lat]], radius } }) }} />
              </div>
          }

          <div className='space-y-2'>
            <Label>Description</Label>
            <Textarea placeholder='Description' className='w-full' value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className='sticky z-20 bottom-0 py-2 bg-background/60 w-full justify-end gap-2 flex backdrop-blur-md'>
            <DialogClose>
              <Button className='' variant='secondary'>Cancle</Button>
            </DialogClose>
            <Button className='' onClick={handleSubmit}>Create Geofence</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateGeofenceButton