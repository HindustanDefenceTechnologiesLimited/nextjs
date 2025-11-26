import { Mission } from '@/lib/types'
import React from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

type Props = {
    mission: Mission | null
}

const MissionDetailSidebar = ({mission}: Props) => {
  return (
    <div className='p-2 flex justify-between'>
          <div>
            <h2 className='text-lg font-semibold'>{mission?.name}</h2>
            <p className='text-xs text-muted-foreground'>Description: {mission?.description}</p>
            <div className='flex gap-2 mt-1'>
              <Badge className='capitalize'>{mission?.type}</Badge>
              <Badge className='capitalize'>{mission?.status}</Badge>
            </div>
          </div>
          <Button>
            asd
          </Button>
        </div>
  )
}

export default MissionDetailSidebar