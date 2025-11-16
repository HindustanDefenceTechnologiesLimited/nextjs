import React from 'react'
import { ModeToggle } from '../ui/theme-toggle'

type Props = {}

const MiniBar = (props: Props) => {
    return (
        <div className='w-12 bg-card border-r flex flex-col items-center gap-2 py-2'>
            <img src="/LightLogo.svg" alt="logo" className='w-8 h-8' />
            <footer className='mt-auto'>
                <ModeToggle />
            </footer>
        </div>
    )
}

export default MiniBar