import api from '@/lib/auth';
import { Track } from '@/lib/types';
import { useAppDispatch } from '@/store/hook'
import { setError, setLoading, updateTrack } from '@/store/slices/missionSlice';
import { RootState } from '@/store/store';
import React, { useEffect } from 'react'
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
type Props = {
    track: Track
}

const TrackPosition = ({ track }: Props) => {
    const dispatch = useAppDispatch();
    const mission = useSelector((state: RootState) => state.mission.data);
    useEffect(() => {
        const fetchTrackPositions = async () => {
            try {
                dispatch(setLoading(true));
                const response = await api.post('/api/trackpositions/multiple', {
                    'trackId': track.id
                });
                console.log(response.data.data);
                dispatch(updateTrack({ ...track, positions: response.data.data } as Track));
            } catch (error) {
                dispatch(setError('Failed to fetch track positions'));
            } finally {
                dispatch(setLoading(false));
            }
        }
        fetchTrackPositions();
    }, [])
    return (
        <div>
            <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="track-positions"
            >
                <AccordionItem value="track-positions">
                    <AccordionTrigger className='cursor-pointer'>Track Positions</AccordionTrigger>
                    <AccordionContent className='max-h-80 overflow-y-auto'>
                        {

                            mission.tracks?.find((trk) => trk.id === track.id)?.positions?.map((position) => {
                                return (
                                    <div key={position.id} className='hover:bg-input pl-2 flex justify-between items-center rounded-md'>
                                        <span className='text-sm'>{format(new Date(position.timestamp), 'dd/MM/yyyy HH:mm:ss')}</span>
                                        <Button variant='ghost' size='icon-sm'>
                                            <MapPinIcon className='w-4 h-4' />
                                        </Button>
                                    </div>
                                )
                            })
                        }
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </div>
    )
}

export default TrackPosition