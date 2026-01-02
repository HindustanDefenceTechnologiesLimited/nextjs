import AudioFeed from '@/components/communication/audio-feeds'
import VideoFeed from '@/components/communication/video-feeds'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { LiveWaveform } from '@/components/ui/elevenlabs/live-waveform'
import { ScrollingWaveform, Waveform } from '@/components/ui/elevenlabs/waveform'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  const data = Array.from({ length: 50 }, () => Math.random())

  return (
    <div className='w-full pr-2'>
      <AudioFeed/>
      <VideoFeed/>
    </div>
  )
}

export default page