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
    <div>
      Mission Detail Page - Mission ID: {missionId}
      <MissionLeftSidebar />
    </div>
  )
}
