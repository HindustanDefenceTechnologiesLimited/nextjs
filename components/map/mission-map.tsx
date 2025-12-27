import React, { useEffect } from 'react'
import SimpleMap from './core/map-view'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

type Props = {}

const MissionMap = (props: Props) => {
    const mission = useSelector((state: RootState) => state.mission.data);

    return (
        <div className='w-full h-[95vh] pr-2'>
            <SimpleMap
                entites={{
                    tracks: mission.tracks || [],
                    geofences: mission.geofences || [],
                    assets: mission.assets || [],
                    annotations: mission.annotations || [],
                    objectives: mission.objectives || []
                }}
            />
        </div>
    )
}

export default MissionMap