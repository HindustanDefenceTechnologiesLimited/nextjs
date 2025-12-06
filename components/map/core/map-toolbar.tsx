import { Button } from '../../ui/button'
import {  RotateCwIcon } from 'lucide-react'
import { useMap } from './map-context';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

type Props = {}

const MapToolbar = (props: Props) => {
  const map = useMap();
  const mission = useSelector((state: RootState) => state.mission.data);
  const handleResetMapCenter = () => {
    if(!mission.mapCoordinates) return
    map?.flyTo({ center: [mission.mapCoordinates?.center.lng, mission.mapCoordinates?.center.lat], zoom: 15 })
  };
  return (
    <div className='flex absolute top-2 left-2 z-9 backdrop-blur rounded-md gap-1 p-1'>
        <Button size='icon-sm'  className='w-6 h-6 bg-background hover:bg-background/60 text-foreground' 
        onClick={handleResetMapCenter}
        >
            <RotateCwIcon className='w-3 h-3' />
        </Button>
    </div>
  )
}

export default MapToolbar