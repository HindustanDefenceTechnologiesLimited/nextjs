'use client'
import React from 'react'
import { Card } from '../ui/card'
import { ScrollingWaveform } from '../ui/elevenlabs/waveform'
import { Button } from '../ui/button'
import { Volume2Icon, VolumeOffIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
    muted: boolean
    setMute: (muted: boolean) => void
}

const AudioCard = ({ muted, setMute }: Props) => {

    const toggleMute = () => {
        setMute(!muted)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.code === 'Space') {
            e.preventDefault()
            toggleMute()
        }
    }

    return (
        <Card
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className={cn(
                'py-2 px-2 gap-2 cursor-pointer outline-none',
                'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
            )}
        >
            <div className='flex px-1 items-center justify-between'>
                <div className='-space-y-2'>
                    <p className='text-sm'>Patrol Vehicle Bravo-3</p>
                    <span className='text-xs text-muted-foreground'>sensor name</span>
                </div>

                <div className='flex items-center'>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                        <span className="text-muted-foreground text-xs">Live</span>
                    </div>

                    <Button
                        size='icon-sm'
                        variant='ghost'
                        onClick={toggleMute}
                        tabIndex={-1}
                    >
                        <Volume2Icon
                            data-mute={muted}
                            className='size-4 text-muted-foreground data-[mute=true]:hidden'
                        />
                        <VolumeOffIcon
                            data-mute={muted}
                            className='size-4 text-muted-foreground hidden data-[mute=true]:block'
                        />
                    </Button>
                </div>
            </div>

            <ScrollingWaveform
                data={Array.from({ length: 50 }, () => Math.random())}
                height={100}
                barWidth={4}
                barGap={2}
                barColor={muted ? '#9ca3af' : '#10b981'}
            />
        </Card>
    )
}

export default AudioCard
