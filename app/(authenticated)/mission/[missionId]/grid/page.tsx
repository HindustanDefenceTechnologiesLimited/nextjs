'use client'
import GeofenceGrid from '@/components/grid/geofence/geofence-grid'
import TracksGrid from '@/components/grid/track/tracks-grid'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div>
      <TracksGrid/>
      <GeofenceGrid/>
    </div>
  )
}

export default page