'use client'
import React from 'react'
import { Button } from '../ui/button'
import { AlertTriangleIcon, File, HeadsetIcon, ListTodoIcon, Map, Table2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
type Props = {}

const Header = (props: Props) => {
    const pathname = usePathname()
    const missionPath = pathname.split('/')
    return (
        <div className='h-10 flex items-center justify-center'>
            <div className='flex gap-1 '>
                <Link href={'/mission/' + missionPath[2]}>
                    <Button variant={missionPath.length === 3 ? 'secondary' : 'ghost'} size='sm' className='text-sm font-normal'>
                        <Map className='w-4 h-4' /> Map
                    </Button>
                </Link>
                <Link href={'/mission/' + missionPath[2] + '/grid'}>
                    <Button variant={missionPath[3] === 'grid' ? 'secondary' : 'ghost'} size='sm' className='text-sm font-normal'>
                        <Table2 className='w-4 h-4' /> Grid
                    </Button>
                </Link>
                <Link href={'/mission/' + missionPath[2] + '/alert'}>
                    <Button variant={missionPath[3] === 'alert' ? 'secondary' : 'ghost'} size='sm' className='text-sm font-normal'>
                        <AlertTriangleIcon className='w-4 h-4' /> Alerts
                    </Button>
                </Link>
                <Link href={'/mission/' + missionPath[2] + '/objective'}>
                    <Button variant={missionPath[3] === 'objective' ? 'secondary' : 'ghost'} size='sm' className='text-sm font-normal'>
                        <ListTodoIcon className='w-4 h-4' /> Objectives
                    </Button>
                </Link>
                <Link href={'/mission/' + missionPath[2] + '/communication'}>
                    <Button variant={missionPath[3] === 'communication' ? 'secondary' : 'ghost'} size='sm' className='text-sm font-normal'>
                        <HeadsetIcon className='w-4 h-4' /> Communication
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default Header