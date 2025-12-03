import api from '@/lib/auth';
import { Track, TrackPosition } from '@/lib/types';
import { useAppDispatch } from '@/store/hook'
import { setError, setLoading, updateTrack } from '@/store/slices/missionSlice';
import { RootState } from '@/store/store';
import { useEffect } from 'react'
import { useSelector } from 'react-redux';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { MapPinIcon } from 'lucide-react';
import { setMapData, setMapType } from '@/store/slices/mapSlice';
import NewTrackPosition from './new-track-postion';
type Props = {
    track: Track
}

const TrackPositions = ({ track }: Props) => {
    const dispatch = useAppDispatch();

    // Always get the LIVE track from redux
    const currentTrack = useSelector((state: RootState) =>
        state.mission.data.tracks?.find((t) => t.id === track.id)
    );

    const positions = currentTrack?.positions || [];

    useEffect(() => {
        const fetchTrackPositions = async () => {
            try {
                dispatch(setLoading(true));
                const response = await api.post('/api/trackpositions/multiple', {
                    trackId: track.id,
                    timestampOrder: 'desc'
                });

                dispatch(updateTrack({
                    id: track.id,
                    positions: response.data.data,
                }));
            } catch (error) {
                dispatch(setError('Failed to fetch track positions'));
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchTrackPositions();
    }, [track.id, dispatch]);

    return (
        <div>
            <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="track-positions"
            >
                <AccordionItem value="track-positions">
                    <AccordionTrigger className="cursor-pointer">
                        Track Positions
                    </AccordionTrigger>

                    <AccordionContent className="max-h-80 overflow-y-auto ">
                        <NewTrackPosition track={track} onCreate={(newTrkPos)=>console.log(newTrkPos)} />
                        {positions.length === 0 && (
                            <div className="text-muted-foreground text-sm p-2">
                                No positions available
                            </div>
                        )}

                        {positions.map((position: TrackPosition) => (
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
                                        dispatch(setMapType('trackPosition'));
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

export default TrackPositions;
