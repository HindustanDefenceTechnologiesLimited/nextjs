import api from '@/lib/auth';
import { Asset, AssetPosition } from '@/lib/types';
import { useAppDispatch } from '@/store/hook'
import { setError, setLoading, updateTrack } from '@/store/slices/missionSlice';
import { RootState } from '@/store/store';
import { useEffect } from 'react'
import { useAppSelector } from '@/store/hook';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { MapPinIcon } from 'lucide-react';
import { setMapData, setMapType, setRouteFocusData, setRouteFocusEntity } from '@/store/slices/mapSlice';
import NewAssetPosition from './new-asset-position';
type Props = {
    asset: Asset
}

const AssetPositions = ({ asset }: Props) => {
    const dispatch = useAppDispatch();

    // Always get the LIVE track from redux
    const currentAsset = useAppSelector((state: RootState) =>
        state.mission.data.assets?.find((a) => a.id === asset.id)
    );

    const positions = currentAsset?.positions || [];


    return (
        <div>
            <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="asset-positions"
            >
                <AccordionItem value="asset-positions">
                    <AccordionTrigger className="cursor-pointer">
                        Asset Positions
                    </AccordionTrigger>

                    <AccordionContent className="max-h-80 overflow-y-auto ">
                        <div className='flex gap-1 w-full mb-2'>
                            <NewAssetPosition asset={asset} onCreate={(newAssetPos) => console.log(newAssetPos)} key={`new-asset-position-${positions.length}`} />
                            <Button size='sm' className='w-1/2' onClick={() => {
                                dispatch(setRouteFocusEntity(asset))
                                dispatch(setRouteFocusData(currentAsset?.positions || []))
                            }}>
                                Show track route
                            </Button>
                        </div>
                        {positions.length === 0 && (
                            <div className="text-muted-foreground text-sm p-2">
                                No positions available
                            </div>
                        )}

                        {positions.map((position: AssetPosition) => (
                            <div
                                key={position.id}
                                className="hover:bg-input pl-2 flex justify-between items-center rounded-md"
                            >
                                <span className="text-sm">
                                    {format(new Date(position.timestamp), 'dd/MM/yyyy HH:mm:ss')}
                                </span>

                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() => {
                                        dispatch(setMapType('assetPosition'));
                                        dispatch(setMapData(position));
                                    }}
                                >
                                    <MapPinIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default AssetPositions;
