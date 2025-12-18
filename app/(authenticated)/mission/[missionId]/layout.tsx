'use client'
import Header from '@/components/mission/header'
import MissionLeftSidebar from '@/components/mission/mission-left-sidebar'
import api from '@/lib/auth'
import { Mission } from '@/lib/types'
import { useAppDispatch } from '@/store/hook'
import { setError, setLoading, setMission } from '@/store/slices/missionSlice'
import { setSidebarData, setSidebarType } from '@/store/slices/sidebarSlice'
import React, { use, useEffect } from 'react'
import { toast } from 'sonner'

type Props = {
    children: React.ReactNode,
    params: Promise<{ missionId: string }>
}

const layout = ({ children, params }: Props) => {
    const { missionId } = use(params);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(setSidebarData(null));
        dispatch(setSidebarType(null));

        const fetchMission = async () => {
            try {
                toast.loading('Loading mission data', { id: missionId });
                dispatch(setLoading(true));
                const response = await api.post('/api/mission/' + missionId,
                    {
                        'assets': true,
                        'alerts': true,
                        'sensors': true,
                        'geofences': true,
                        'tracks': true,
                        'annotations': true
                    }
                );
                dispatch(setMission(response.data.data as Mission));
            } catch (error) {
                dispatch(setError('Failed to fetch mission' + missionId));
                toast.error('Failed to fetch mission' + missionId);
            } finally {
                dispatch(setLoading(false));
                toast.dismiss(missionId);
            }
        };
        fetchMission();
    }, []);

    return (
        <div className='flex h-screen'>
            <MissionLeftSidebar />
            <main className='w-full' >
                <Header/>
                <div className='max-h-[calc(100vh-2.5em)] overflow-y-auto w-full'>
                {children} 
                </div>
            </main>
        </div>
    )
}

export default layout