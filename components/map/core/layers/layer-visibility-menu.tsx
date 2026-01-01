import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { RootState } from '@/store/store';
import { setAllMapElementVisibility, setMapElementVisibility } from '@/store/slices/mapSlice';
import { CheckIcon, EyeIcon } from 'lucide-react';
type Props = {}

const LayerVisibilityLayer = (props: Props) => {
    const mapElementsVisibility = useAppSelector((state: RootState) => state.map.mapElementsVisibility);
    const dispatch = useAppDispatch();
    const handleItemClick = (layerName: MapLayer) => {
        if (mapElementsVisibility[layerName]) {
            dispatch(setMapElementVisibility({ key: layerName, value: false }));
        }
        else {
            dispatch(setMapElementVisibility({ key: layerName, value: true }));
        }
    }
    return (
        <div className='absolute top-2 right-12 z-10'>

            <Popover>
                <PopoverTrigger asChild>
                    <Button size='icon-sm' variant='secondary' className='bg-card border'>
                        <EyeIcon className='size-4' />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='p-1 w-40' align='end'>
                    <div className='flex flex-col'>
                        <div className='flex gap-2 items-center rounded px-2 py-1 hover:bg-muted cursor-pointer'
                            onClick={() => dispatch(setAllMapElementVisibility({ value: false }))}
                        >
                            <span className='capitalize text-sm'>
                                Hide all
                            </span>
                        </div>
                        <div className='flex gap-2 items-center rounded px-2 py-1 hover:bg-muted cursor-pointer'
                            onClick={() => dispatch(setAllMapElementVisibility({ value: true }))}
                        >
                            <span className='capitalize text-sm'>
                                Show all
                            </span>
                        </div>
                        {
                            Object.keys(mapElementsVisibility).map((layerName: string, index: number) => (
                                <div className='flex gap-2 items-center rounded px-2 py-1 hover:bg-muted cursor-pointer' key={index}
                                    onClick={() => handleItemClick(layerName as MapLayer)}
                                >
                                    <CheckIcon data-checked={mapElementsVisibility[layerName as MapLayer]} className='h-3 w-3 data-[checked=false]:opacity-0 data-[checked=true]:opacity-100' />
                                    <span className='capitalize text-sm'>
                                        {layerName}
                                    </span>
                                </div>
                            ))
                        }
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default LayerVisibilityLayer

type MapLayer = 'tracks' | 'assets' | 'geofences' | 'focuses' | 'annotations' | 'objectives' | 'directions' | 'toolbar';