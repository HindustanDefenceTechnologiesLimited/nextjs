'use client'
import React from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import {
    Volume2Icon,
    VolumeOffIcon,
    VideoIcon,
    PlayIcon,
    PauseIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
    muted: boolean
    playing: boolean
    setMute: (muted: boolean) => void
    setPlaying: (playing: boolean) => void
}

const VideoCard = ({ muted, playing, setMute, setPlaying }: Props) => {
    const videoRef = React.useRef<HTMLVideoElement | null>(null)

    /* Sync mute */
    React.useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = muted
        }
    }, [muted])

    /* Sync play / pause */
    React.useEffect(() => {
        if (!videoRef.current) return
        playing ? videoRef.current.play() : videoRef.current.pause()
    }, [playing])

    const toggleMute = () => setMute(!muted)
    const togglePlay = () => setPlaying(!playing)

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.code === 'Space') {
            e.preventDefault()
            toggleMute()
        }
        if (e.code === 'Enter') {
            e.preventDefault()
            togglePlay()
        }
    }

    return (
        <Card
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className={cn(
                'relative p-0 overflow-hidden cursor-pointer outline-none',
                'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
            )}
        >
            {/* VIDEO */}
            <video
                ref={videoRef}
                autoPlay={false}
                playsInline
                loop
                className="w-full h-full object-cover"
                src="/sample-video.mp4"
            />

            {/* TOP OVERLAY */}
            <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs bg-black/60 px-2 py-1 rounded">
                    <VideoIcon className="w-3 h-3 text-green-400" />
                    <span className="text-white">Drone Feed Alpha-1</span>
                </div>

                <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded">
                    <span className="flex items-center gap-1 text-xs text-white">
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        Live
                    </span>

                    <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={togglePlay}
                        tabIndex={-1}
                    >
                        <PlayIcon
                            data-play={playing}
                            className="w-4 h-4 text-white data-[play=true]:hidden"
                        />
                        <PauseIcon
                            data-play={playing}
                            className="w-4 h-4 text-white hidden data-[play=true]:block"
                        />
                    </Button>

                    <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={toggleMute}
                        tabIndex={-1}
                    >
                        <Volume2Icon
                            data-mute={muted}
                            className="w-4 h-4 text-white data-[mute=true]:hidden"
                        />
                        <VolumeOffIcon
                            data-mute={muted}
                            className="w-4 h-4 text-white hidden data-[mute=true]:block"
                        />
                    </Button>
                </div>
            </div>

            {/* PAUSED OVERLAY */}
            {!playing && (
                <div className="absolute pointer-events-none inset-0 bg-black/40 flex items-center justify-center">
                    <PlayIcon className="w-12 h-12 text-white opacity-80" />
                </div>
            )}
        </Card>
    )
}

export default VideoCard
