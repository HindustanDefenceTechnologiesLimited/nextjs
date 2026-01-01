import { Mission, MissionStatus } from '@/lib/types'
import React from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import EntityCreateButton from './entity-create-button'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { RootState } from '@/store/store'
import api from '@/lib/auth'
import { toast } from 'sonner'
import { updateMission } from '@/store/slices/missionSlice'


const MissionDetailSidebar =  () => {
  const mission = useAppSelector((state: RootState) => state.mission.data);
  const dispatch = useAppDispatch();
  const handleMissionStatusChange = async (value: MissionStatus) => { 
    try {
      const res = await api.put(`/api/mission/update/${mission?.id}`, { status: value });
      if(res.status != 201) {
        toast.error("Something went wrong");
      };
      dispatch(updateMission({ status: value }));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='p-2'>
        <h2 className='text-lg font-semibold'>{mission?.name}</h2>
        <p className='text-xs text-muted-foreground truncate'>{mission?.description}</p>
        <div className='flex gap-2 mt-1 w-full items-center'>
          <Badge className='capitalize h-fit'>{mission?.type}</Badge>
          <Select defaultValue={mission?.status} onValueChange={handleMissionStatusChange}>
            <SelectTrigger  size='sm'>
              <SelectValue placeholder="Status" className='h-5 py-0 ml-auto' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Mission Status</SelectLabel>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="PAUSED">Paused</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <EntityCreateButton/>
        </div>

    </div>
  )
}

export default MissionDetailSidebar