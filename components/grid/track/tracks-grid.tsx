import TrackTable from './track-table'
import { useAppSelector } from '@/store/hook'
import { RootState } from '@/store/store'


const TracksGrid = () => {
  const mission = useAppSelector((state: RootState) => state.mission.data);
  return (
    <div className='pr-2 py-2'>
      <TrackTable tracks={mission.tracks || []} />
    </div>
  )
}

export default TracksGrid