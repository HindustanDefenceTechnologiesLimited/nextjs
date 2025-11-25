 'use client'
import api from '@/lib/auth'
import { useAppDispatch } from '@/store/hook'
import { setError, setLoading } from '@/store/slices/missionsSlice'
import React, { use, useEffect } from 'react'

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
                dispatch(setLoading(true));
                const response = await api.get('/api/mission/' + missionId);
                // dispatch(setMissions(response.data.data as Mission[]));
            } catch (error) {
                // dispatch(setError('Failed to fetch missions'));
            } finally {
                dispatch(setLoading(false));
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