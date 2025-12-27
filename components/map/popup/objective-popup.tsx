import { Objective, ObjectiveStatus, ObjectiveType } from '@/lib/types'
import React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import api from '@/lib/auth'
import { toast } from 'sonner'
import { useAppDispatch } from '@/store/hook'
import { deleteAnnotation, deleteObjective, updateAnnotation, updateObjective } from '@/store/slices/missionSlice'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CircleCheckIcon, MessageCircleIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Props = {
  objective: Objective
}

const ObjectivePopup = ({ objective }: Props) => {
  const [form, setForm] = React.useState({
    title: objective.title,
    description: objective.description,
    status: objective.status,
    type: objective.type
  });
  const dispatch = useAppDispatch();
  const disable = form.title === objective.title && form.description === objective.description && form.status === objective.status && form.type === objective.type
  const handleSave = async (e: any) => {
    try {
      if (form.title === "") return toast.error("Title is required");
      const res = await api.put(`/api/objective/update/${objective.id}`, form)
      if (res.data.success) {
        dispatch(updateObjective(res.data.data));
        toast.success("Objective updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update objective");
    }
  }
  const handleDelete = async () => {
    try {
      const res = await api.delete(`/api/objective/delete/${objective.id}`);
      if (res.data.success) {
        dispatch(deleteObjective(objective.id));
        toast.success("Objective deleted successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete objective");
    }
  }
  return (
    <div className='relative'>
      <Popover>
        <PopoverTrigger asChild>
          <div className='absolute cursor-pointer group bottom-0 left-0 truncate bg-amber-700 text-white font-light text-[11px] px-2 py-2/3 rounded-t-xl rounded-br-xl flex flex-1 items-center gap-1'>
            <CircleCheckIcon className='w-3 h-3 aspect-square' /> {objective.title}
          </div>
        </PopoverTrigger>
        <PopoverContent align='start' side='top' className='rounded-xl space-y-2 max-h-90 overflow-y-auto'>
          <Label className='text-xs'>Title</Label>
          <Input className='text-xs' value={form.title} placeholder='Title' onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Label className='text-xs'>Description</Label>
          <Textarea className='text-xs' value={form.description || ""} placeholder='Description...' onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Label>Type *</Label>
          <Select onValueChange={(e: ObjectiveType) => setForm({ ...form, type: e })} value={form.type}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select objective type' className='w-full' />
            </SelectTrigger>
            <SelectContent>
              {
                Object.keys(ObjectiveType).map((key) => (
                  <SelectItem key={key} value={key}>{key}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
          <Label>Status *</Label>
          <Select onValueChange={(e: ObjectiveStatus) => setForm({ ...form, status: e })} value={form.status}>
            <SelectTrigger className='w-full' >
              <SelectValue placeholder='Select objective status' className='w-full' />
            </SelectTrigger>
            <SelectContent>
              {
                Object.keys(ObjectiveStatus).map((key) => (
                  <SelectItem key={key} value={key}>{key}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
          <div className='flex justify-end gap-2'>
            <Button size='sm' variant='destructive' className='h-6' onClick={handleDelete}>Delete</Button>
            <Button size='sm' className='h-6' onClick={handleSave} disabled={disable} >Save</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default ObjectivePopup