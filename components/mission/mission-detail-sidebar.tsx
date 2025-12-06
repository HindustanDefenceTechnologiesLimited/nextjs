import { Mission } from '@/lib/types'
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
type Props = {
  mission: Mission | null
}

const MissionDetailSidebar = ({ mission }: Props) => {
  return (
    <div className='p-2'>
        <h2 className='text-lg font-semibold'>{mission?.name}</h2>
        <p className='text-xs text-muted-foreground'>Description: {mission?.description}</p>
        <div className='flex gap-2 mt-1 w-full items-center'>
          <Badge className='capitalize h-fit'>{mission?.type}</Badge>
          <Badge className='capitalize h-fit'>{mission?.status}</Badge>
          <Select>
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