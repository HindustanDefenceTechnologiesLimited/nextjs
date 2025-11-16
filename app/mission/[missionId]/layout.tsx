'use client'
import MiniBar from '@/components/mission-layout/MiniBar'
import CreateMissionButton from '@/components/mission/CreateMissionButton'
import React, { use } from 'react'

type Props = {
    children: React.ReactNode,
    params: Promise<{ missionId: string }>
}

const layout = ({ children, params }: Props) => {
    const { missionId } = use(params)
    return (
        <div className='flex h-screen'>
            <MiniBar />
            <main className='w-full '>
                <CreateMissionButton onMissionCreated={() => {}} />
            {children}
            </main>
        </div>
    )
}

export default layout