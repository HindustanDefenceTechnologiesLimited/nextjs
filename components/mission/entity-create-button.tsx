import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PlusIcon } from 'lucide-react'
import { Button } from '../ui/button'
import CreateGeofenceButton from './create/create-geofence-button'
import CreateTrackButton from './create/create-track-button'
import CreateAssetButton from './create/create-asset-button'
type Props = {}

const EntityCreateButton = (props: Props) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size='icon-sm' variant='secondary' className='ml-auto'>
                    <PlusIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side='right' align='start'>
                <DropdownMenuLabel>Create new entity</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <CreateGeofenceButton/>
                <CreateTrackButton/>
                <CreateAssetButton/>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default EntityCreateButton