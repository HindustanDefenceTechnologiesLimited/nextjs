'use client'
import MissionLeftSidebar from '@/components/mission/mission-left-sidebar'
import UploadFiles from '@/components/file/upload-files'
import { use } from 'react'
import { useAppSelector } from '@/store/hook'
import { RootState } from '@/store/store'
import MissionMap from '@/components/map/mission-map'

type Props = {}

export default function Page({
  params,
}: {
  params: Promise<{ missionId: string }>
}) {
  const { missionId } = use(params)
  return (
    <MissionMap />
  )
}
