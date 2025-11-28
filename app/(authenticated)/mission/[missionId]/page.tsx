'use client'
import MissionLeftSidebar from '@/components/mission/mission-left-sidebar'
import UploadFiles from '@/components/file/upload-files'
import { use } from 'react'
import { useAppSelector } from '@/store/hook'
import { RootState } from '@/store/store'

type Props = {}

export default function Page({
  params,
}: {
  params: Promise<{ missionId: string }>
}) {
  const { missionId } = use(params)
  const map = useAppSelector((state: RootState)=> state.map.data);
  return (
    <div className='flex h-screen'>
      <MissionLeftSidebar />
      <main className='w-3/4'>
      {JSON.stringify(map)}
      </main>
    </div>
  )
}
