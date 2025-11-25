'use client'
import MissionGridList from '@/components/mission-layout/mission-list-grid'
import React, { useEffect } from 'react'
import { addMission, removeMission, setMissions, setLoading, setError } from '@/store/slices/missionsSlice';
import api from '@/lib/auth';
import { Mission } from '@/lib/types';
import { useAppDispatch } from '@/store/hook';

type Props = {}

const page = (props: Props) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchMissions = async () => {
            try {
                dispatch(setLoading(true));
                const response = await api.get('/api/mission/byuser');
                dispatch(setMissions(response.data.data as Mission[]));
            } catch (error) {
                dispatch(setError('Failed to fetch missions'));
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchMissions();
    }, []);
  return (
    <div>
      <MissionGridList/>
    </div>
  )
}

export default page