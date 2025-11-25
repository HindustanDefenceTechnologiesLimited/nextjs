// mission-left-sidebar.tsx

import { RootState } from '@/store/store';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

type Props = {}

const MissionLeftSidebar = (props: Props) => {
    const mission = useSelector((state: RootState) => state.mission.data);
    useEffect(() => {
        console.log(mission);
    }, [mission])
  return (
    <div>MissionLeftSidebar</div>
  )
}

export default MissionLeftSidebar