'use client'
import React from 'react'
import VideoCard from './video-card'
import { Button } from '../ui/button'
import {
    VideoIcon,
    Volume2Icon,
    VolumeOffIcon,
    PlayIcon,
    PauseIcon,
} from 'lucide-react'

const FEED_COUNT = 8

const VideoFeed = () => {
    const [mutedMap, setMutedMap] = React.useState<boolean[]>(
        Array(FEED_COUNT).fill(false)
    )

    const [playingMap, setPlayingMap] = React.useState<boolean[]>(
        Array(FEED_COUNT).fill(true)
    )

    /* Global controls */
    const muteAll = () => setMutedMap(Array(FEED_COUNT).fill(true))
    const unmuteAll = () => setMutedMap(Array(FEED_COUNT).fill(false))
    const playAll = () => setPlayingMap(Array(FEED_COUNT).fill(true))
    const pauseAll = () => setPlayingMap(Array(FEED_COUNT).fill(false))

    const setCardMute = (i: number, muted: boolean) =>
        setMutedMap(prev => {
            const next = [...prev]
            next[i] = muted
            return next
        })

    const setCardPlaying = (i: number, playing: boolean) =>
        setPlayingMap(prev => {
            const next = [...prev]
            next[i] = playing
            return next
        })

    return (
        <div className="w-full">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-lg flex items-center">
                    <VideoIcon className="w-5 h-5 mr-1 text-blue-500" />
                    Video Feeds
                </p>

                <div className="flex gap-1 flex-wrap">
                    <Button size="sm" variant="secondary" onClick={pauseAll}>
                        <PauseIcon className="w-4 h-4 mr-1" />
                        Pause All
                    </Button>
                    <Button size="sm" variant="secondary" onClick={playAll}>
                        <PlayIcon className="w-4 h-4 mr-1" />
                        Play All
                    </Button>
                    <Button size="sm" variant="secondary" onClick={muteAll}>
                        <VolumeOffIcon className="w-4 h-4 mr-1" />
                        Mute All
                    </Button>
                    <Button size="sm" variant="secondary" onClick={unmuteAll}>
                        <Volume2Icon className="w-4 h-4 mr-1" />
                        Unmute All
                    </Button>
                </div>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-4 gap-2">
                {mutedMap.map((muted, idx) => (
                    <VideoCard
                        key={idx}
                        muted={muted}
                        playing={playingMap[idx]}
                        setMute={(m) => setCardMute(idx, m)}
                        setPlaying={(p) => setCardPlaying(idx, p)}
                    />
                ))}
            </div>
        </div>
    )
}

export default VideoFeed
