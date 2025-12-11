import { Geofence } from '@/lib/types'
import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CircleIcon, Edit2, Edit2Icon, RectangleHorizontalIcon, Trash2Icon, VectorSquareIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
type Props = {
    geofence: Geofence
}

const GeofencePopup = ({ geofence }: Props) => {
    return (

        <Popover>
            <PopoverTrigger data-type={geofence.geometry.shapeType} className='-translate-y-[60%] data-[type=rectangle]:translate-x-[50%]'>
                <div
                    
                    className='cursor-pointer text-white font-light font-sans text-[11px] bg-blue-600 px-1 rounded  flex items-center gap-1'
                >
                    <VectorSquareIcon className='w-3 aspect-square' />
                    {geofence.name}
                </div>
            </PopoverTrigger>
            <PopoverContent side='top' align='start' className=' p-1'>
                <div className='flex'>
                    <Button variant='destructive' size='icon-sm'>
                        <Trash2Icon className='w-4 h-4' />
                    </Button>
                    <Button variant='ghost' size='icon-sm'>
                        <Edit2Icon className='w-4 h-4' />
                    </Button>
                </div>
                <Separator/>
                <div>
                   
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default GeofencePopup