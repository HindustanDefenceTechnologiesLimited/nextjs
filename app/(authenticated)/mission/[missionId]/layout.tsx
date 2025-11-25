 'use client'
import api from '@/lib/auth'
import { Mission } from '@/lib/types'
import { useAppDispatch } from '@/store/hook'
import { setError, setLoading, setMission } from '@/store/slices/missionSlice'
import React, { use, useEffect } from 'react'
import { toast, useSonner } from 'sonner'

type Props = {
    children: React.ReactNode,
    params: Promise<{ missionId: string }>
}

const layout = ({ children, params }: Props) => {
    const { missionId } = use(params);
    const dispatch = useAppDispatch();
    useEffect(() => {
        const fetchMission = async () => {
            try {
                toast.loading('Loading mission data', { id: missionId });
                dispatch(setLoading(true));
                const response = await api.post('/api/mission/' + missionId, 
                    {
                        'assets': true,
                        'alerts': true,
                        'sensors': true
                    });
                    console.log(response.data.data);
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
        <>
            {children}
        </>
    )
}

export default layout