import { ChevronUpIcon, WrenchIcon } from 'lucide-react'
import React, { useState } from 'react'

type Props = {}

const OptionsLayer = (props: Props) => {
    const [open, setOpen] = useState(false);
    return (
        <div className='absolute bottom-0 right-2 z-9'>
            {
                open &&
                <div className='flex flex-col gap-2'>
                    <div>aca</div>
                    <div>aca</div>
                    <div>aca</div>
                </div>
            }
            <div className='flex items-center gap-3'>
            <img src="/hdtl-light.svg" alt="HDTL Logo" className='h-3 opacity-50' />
            <div className="flex  bg-card border-t border-x px-2 rounded-t-md  gap-1 p-1 group" onClick={() => setOpen(!open)}>
                <span className='flex gap-2 items-center text-sm cursor-pointer'>
                    {/* <WrenchIcon className='w-4 h-4' />  */}
                    Options
                    <ChevronUpIcon data-open={open} className='w-4 h-4 data-[open=true]:rotate-180' />
                </span>
            </div>
            </div>

        </div>
    )
}

export default OptionsLayer