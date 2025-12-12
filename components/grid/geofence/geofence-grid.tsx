import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import GeofenceTable from './geofence-table'
type Props = {}

const GeofenceGrid = (props: Props) => {
      const mission = useSelector((state: RootState) => state.mission.data);

  return (
        <div className='pr-2 py-2'>
          <GeofenceTable geofences={mission.geofences || []} />
        </div>
  )
}

export default GeofenceGrid