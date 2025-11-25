'use client'
import MiniBar from '@/components/mission-layout/mini-bar'
import CreateMissionButton from '@/components/mission/mission-create-button'
import useAuthInit from '@/hooks/use-auth-init'
import { useRouter } from 'next/navigation'
import React, { use, useEffect } from 'react'
import { useSelector } from 'react-redux'

type Props = {
    children: React.ReactNode,
    params: Promise<{ missionId: string }>
}

const layout = ({ children, params }: Props) => {
    const { missionId } = use(params)
    useAuthInit(); // Load token from cookies

    const router = useRouter();
    const isAuthenticated = useSelector((s: any) => s.auth.isAuthenticated);
    const isLoading = useSelector((s: any) => s.auth.isLoading);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return <div className="flex items-center justify-center h-[100vh]">Checking Authentication...</div>;
    }
    return (
        <div className='flex h-screen'>
            <MiniBar />
            <main className='w-full '>
                {/* <CreateMissionButton onMissionCreated={() => {}} /> */}
                {children}
            </main>
        </div>
    )
}

export default layout