import React from 'react'
import DataGridDemo from '../data-grid'
import TrackTable from './track-table'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

type Props = {}

const TracksGrid = (props: Props) => {
const mission = useSelector((state: RootState) => state.mission.data);
  return (
    <div>
      <TrackTable tracks={mission.tracks || []}/>
    </div>
  )
}

export default TracksGrid