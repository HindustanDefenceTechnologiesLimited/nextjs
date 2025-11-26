'use client'
import MissionLeftSidebar from '@/components/mission/mission-left-sidebar'
import { use } from 'react'

type Props = {}

export default function Page({
  params,
}: {
  params: Promise<{ missionId: string }>
}) {
  const { missionId } = use(params)
  return (
    <div className='flex h-screen'>
      <MissionLeftSidebar />
      <main className='w-3/4'>
      
      </main>
    </div>
  )
}
