import React from 'react'
import DataGridDemo from '../data-grid'
import TrackTable from './track-table'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

type Props = {}

const TracksGrid = (props: Props) => {
const mission = useSelector((state: RootState) => state.mission.data);
const map = useSelector((state: RootState) => state.map.data);
return (
    <div className='pr-2'>
      <TrackTable tracks={mission.tracks || []}/>
    </div>
  )
}

export default TracksGrid