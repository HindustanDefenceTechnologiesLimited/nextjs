import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { PlusIcon } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { RootState } from '@/store/store'
import { ObjectiveStatus, ObjectiveType } from '@/lib/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import api from '@/lib/auth'
import { toast } from 'sonner'
import { addObjective } from '@/store/slices/missionSlice'
type Props = {
    defaultStatus?: ObjectiveStatus;
}


const CreateObjective = ({ defaultStatus }: Props) => {
    const mission = useAppSelector((state: RootState) => state.mission.data);
    const dispatch = useAppDispatch();
    const [form, setForm] = React.useState({
        title: '',
        description: '',
        status: defaultStatus || ObjectiveStatus.NEW,
        type: ObjectiveType.TASK,
    })
    const handleSubmit = async () => {
        try {
            console.log(form);
            const res = await api.post('/api/objective/create', 
                {
                    ...form,
                    missionId: mission?.id
                }
            );
            if(res.status === 201) {
                dispatch(addObjective(res.data.data));
                toast.success('Objective created successfully.');
            }
        } catch (error) {
            toast.error('An unexpected error occurred.');
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='secondary' size='icon-sm'>
                    <PlusIcon className='w-4 h-4' />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Objective</DialogTitle>
                    <DialogDescription>
                        Field marked with * are required
                    </DialogDescription>
                </DialogHeader>
                <div className='space-y-3'>
                    <div className='space-y-2'>
                        <Label>Title *</Label>
                        <Input type='text' placeholder='Enter objective title' onChange={(e) => setForm({ ...form, title: e.target.value })} value={form.title} />
                    </div>
                    <div className='space-y-2'>
                        <Label>Description</Label>
                        <Textarea placeholder='Enter objective description' onChange={(e) => setForm({ ...form, description: e.target.value })} value={form.description} />
                    </div>
                    <div className='flex gap-2 w-full'>

                        <div className='space-y-2 flex-1'>
                            <Label>Type *</Label>
                            <Select defaultValue={ObjectiveType.TASK} onValueChange={(e: ObjectiveType) => setForm({ ...form, type: e })} value={form.type}>
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
                        </div>
                        <div className='space-y-2 flex-1'>
                            <Label>Status *</Label>
                            <Select defaultValue={defaultStatus || ObjectiveStatus.NEW} onValueChange={(e: ObjectiveStatus) => setForm({ ...form, status: e })} value={form.status}>
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
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <Button onClick={handleSubmit}>Create</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateObjective