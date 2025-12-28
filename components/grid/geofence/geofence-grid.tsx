import React from 'react'
import { useAppSelector } from '@/store/hook'
import { RootState } from '@/store/store'
import GeofenceTable from './geofence-table'
type Props = {}

const GeofenceGrid = (props: Props) => {
      const mission = useAppSelector((state: RootState) => state.mission.data);

  return (
        <div className='pr-2 py-2'>
          <GeofenceTable geofences={mission.geofences || []} />
        </div>
  )
}

export default GeofenceGrid