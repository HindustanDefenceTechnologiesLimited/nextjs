import { Button } from '../ui/button'
import {  RotateCwIcon } from 'lucide-react'

type Props = {}

const MapToolbar = (props: Props) => {
  return (
    <div className='flex absolute top-2 left-2 z-9 backdrop-blur rounded-md gap-1 p-1'>
        <Button size='icon-sm'  className='w-6 h-6 bg-background hover:bg-background/60 text-foreground' >
            <RotateCwIcon className='w-3 h-3' />
        </Button>
    </div>
  )
}

export default MapToolbar