'use client'
import React from 'react'
import AudioCard from './audio-card'
import { Button } from '../ui/button'
import { SpeechIcon, Volume2Icon, VolumeOffIcon } from 'lucide-react'

const FEED_COUNT = 8

const AudioFeed = () => {
    const [mutedMap, setMutedMap] = React.useState<boolean[]>(
        Array(FEED_COUNT).fill(false)
    )

    const muteAll = () => {
        setMutedMap(Array(FEED_COUNT).fill(true))
    }

    const unmuteAll = () => {
        setMutedMap(Array(FEED_COUNT).fill(false))
    }

    const setCardMute = (index: number, muted: boolean) => {
        setMutedMap(prev => {
            const next = [...prev]
            next[index] = muted
            return next
        })
    }

    return (
        <div className='w-full'>
            <div className='flex items-center justify-between'>
                <p className='font-medium text-lg flex items-center'>
                    <SpeechIcon className='w-5 h-5 mr-2 text-green-400' />
                    Audio Feeds
                </p>

                <div className='flex gap-1'>
                    <Button variant='secondary' size='sm' onClick={muteAll}>
                        <VolumeOffIcon className='w-4 h-4 mr-1' />
                        Mute All
                    </Button>
                    <Button variant='secondary' size='sm' onClick={unmuteAll}>
                        <Volume2Icon className='w-4 h-4 mr-1' />
                        Unmute All
                    </Button>
                </div>
            </div>

            <div className='grid grid-cols-4 gap-2 py-2'>
                {mutedMap.map((muted, idx) => (
                    <AudioCard
                        key={idx}
                        muted={muted}
                        setMute={(m) => setCardMute(idx, m)}
                    />
                ))}
            </div>
        </div>
    )
}

export default AudioFeed
