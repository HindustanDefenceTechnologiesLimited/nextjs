import { Asset } from '@/lib/types'
import React from 'react'
import DetailLayout from './detail-layout'

type Props = {
    assetId: string
}

const AssetDetail = ({assetId}: Props) => {
  return (
    <DetailLayout>
      {assetId}
    </DetailLayout>
  )
}

export default AssetDetail