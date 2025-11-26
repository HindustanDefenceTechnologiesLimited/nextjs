import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/store/hook'
import { setSidebarData, setSidebarType } from '@/store/slices/sidebarSlice'
import { ChevronLeft } from 'lucide-react'
import React from 'react'

type Props = {
    children?: React.ReactNode,
    headerContent?: React.ReactNode
}

const DetailLayout = ({ children, headerContent }: Props) => {
    const dispatch = useAppDispatch();
    return (
        <div className='h-[98vh] relative overflow-y-auto overflow-x-hidden'>
            <div className='flex items-center gap-2 sticky top-0 z-50 bg-card/30 backdrop-blur-lg rounded-t-md'>
                <Button variant='ghost' size='icon'
                    onClick={() => {
                        dispatch(setSidebarType(null))
                        dispatch(setSidebarData(null))
                    }}
                >
                    <ChevronLeft className='w-4 h-4' />
                </Button>
                {headerContent && headerContent}
            </div>
            {children}
        </div>
    )
}

export default DetailLayout