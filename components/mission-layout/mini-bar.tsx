'use client'
import { ModeToggle } from '../ui/theme-toggle'
import { Button } from '../ui/button'
import { LogOutIcon, User2Icon } from 'lucide-react'
import Link from 'next/link'
import SILogo from '../ui/logo-si'
import LogoutButton from '../auth/logout-button'

type Props = {}

const MiniBar = (props: Props) => {
    return (
        <div className='w-12 bg-card border-r flex flex-col items-center gap-2 py-2 pt-4'>
            <SILogo size={6} />
            <div className='flex flex-col mt-4'>
                <Link href='/mission'>
            <Button variant='ghost' className='h-24 w-8'>
                <span className='-rotate-90'> Missions </span>
            </Button>
                </Link>
            <Button variant='ghost' className='h-18 w-8'>
                <span className='-rotate-90'> Tracks </span>
            </Button>
            <Button variant='ghost' className='h-24 w-8'>
                <span className='-rotate-90'> Settings </span>
            </Button>
            </div>
            <footer className='mt-auto items-center flex flex-col gap-2'>
                <Link href="/profile">
                    <Button variant='outline' size='icon'>
                        <User2Icon className='w-4 h-4' />
                    </Button>
                </Link>
                    <LogoutButton>
                    <Button variant='destructive' size='icon' >
                        <LogOutIcon className='w-4 h-4' />
                    </Button>
                    </LogoutButton>
                <ModeToggle />
            </footer>
        </div>
    )
}

export default MiniBar