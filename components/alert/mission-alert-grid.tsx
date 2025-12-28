import { Alert } from '@/lib/types'
import React, { useEffect } from 'react'
import AlertTable from './mission-alert-table'
import { usePathname } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import api from '@/lib/auth'
import { updateMission } from '@/store/slices/missionSlice'
import { RootState } from '@/store/store'
import { Button } from '../ui/button'
import { RotateCwIcon } from 'lucide-react'


const MissionAlertgrid = () => {
    const pathname = usePathname()
    const missionId = pathname.split('/')[2];
    const mission = useAppSelector((state: RootState) => state.mission.data);
    const [loading, setLoading] = React.useState(false);
    const dispatch = useAppDispatch();
    useEffect(() => {
        fetchMissionAlerts();
    }, [])
    const fetchMissionAlerts = async () => {
        try {
            setLoading(true);
            const response = await api.post(`/api/alert/get/multiple`, {
                missionId: missionId
            });
            const alerts = response.data.data;
            if (response.data.success) {
                dispatch(updateMission({ alerts: alerts }));
            }
            console.log('Fetched mission alerts:', alerts);
        } catch (error) {
            console.error('Error fetching mission alerts:', error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className='pr-2 relative'>
            <Button onClick={fetchMissionAlerts} variant="ghost" size="icon-sm" className='absolute top-4 right-6' disabled={loading}>
                <RotateCwIcon data-loading={loading} className='w-4 h-4 data-[loading=true]:animate-spin' />
            </Button>
            <AlertTable alerts={mission?.alerts || []} />
        </div>
    )
}

export default MissionAlertgrid