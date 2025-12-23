import { Annotation } from '@/lib/types'
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
import { deleteAnnotation, updateAnnotation } from '@/store/slices/missionSlice'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageCircleIcon } from 'lucide-react'

type Props = {
  annotation: Annotation
}

const AnnotationPopup = ({ annotation }: Props) => {
  const [form, setForm] = React.useState({
    title: annotation.title,
    content: annotation.content
  });
  const dispatch = useAppDispatch();
  const disable = form.title === annotation.title && form.content === annotation.content
  const handleSave = async (e: any) => {
    try {
      if (form.title === "") return toast.error("Title is required");
      const res = await api.put(`/api/annotation/update/${annotation.id}`, form)
      if (res.data.success) {
        dispatch(updateAnnotation(res.data.data));
        toast.success("Annotation updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update annotation");
    }
  }
  const handleDelete = async () => {
    try {
      const res = await api.post(`/api/annotation/delete/${annotation.id}`);
      if (res.data.success) {
        dispatch(deleteAnnotation(annotation.id));
        toast.success("Annotation deleted successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete annotation");
    }
  }
  return (
    <div className='relative'>
      <Popover>
        <PopoverTrigger asChild>
          <div className='absolute cursor-pointer group bottom-0 left-0 truncate bg-indigo-700 text-white font-light text-[11px] px-2 py-2/3 rounded-t-xl rounded-br-xl flex flex-1 items-center gap-1'>
           <MessageCircleIcon className='w-3 h-3 aspect-square' fill="white" /> {annotation.title}
          </div>
        </PopoverTrigger>
        <PopoverContent align='start' side='top' className='rounded-xl space-y-2 max-h-90 overflow-y-auto'>

          <Label className='text-xs'>Title</Label>
          <Input className='text-xs' value={form.title} placeholder='Title' onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Label className='text-xs'>Content</Label>
          <Textarea className='text-xs' value={form.content || ""} placeholder='Content...' onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <div className='flex gap-2 rounded-lg bg-accent p-2'>
            <Avatar className="h-8 w-8 rounded-lg grayscale">
              <AvatarFallback className="rounded-lg border">{annotation.user?.firstName.charAt(0)}{annotation.user?.lastName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{annotation.user?.firstName + " " + annotation.user?.lastName}</span>
              <span className="text-muted-foreground truncate text-xs">
                {annotation.user?.username}
              </span>
            </div>
          </div>

          <div className='flex justify-end gap-2'>
            <Button size='sm' variant='destructive' className='h-6' onClick={handleDelete}>Delete</Button>
            <Button size='sm' className='h-6' onClick={handleSave} disabled={disable} >Save</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default AnnotationPopup