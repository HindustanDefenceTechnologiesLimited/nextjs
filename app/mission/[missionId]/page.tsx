import React, { use } from 'react'

type Props = {}

export default function Page({
    params,
}: {
    params: Promise<{ missionId: string }>
}) {
    const { missionId } = use(params)
    return (
        <div>page : {missionId}</div>
    )
}
