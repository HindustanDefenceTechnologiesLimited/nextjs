'use client'
import MissionLeftSidebar from '@/components/mission/mission-left-sidebar'
import React, { use, useEffect, useState } from 'react'

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
        Mission Detail Page - Mission ID: {missionId}
      </main>
    </div>
  )
}
