import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import TrackCreate from './create-track-form'
import { useAppSelector } from '@/store/hook'
import { RootState } from '@/store/store'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
type Props = {}

const CreateTrackButton = (props: Props) => {
    const mission = useAppSelector((state: RootState) => state.mission.data);
    const [open, setOpen] = React.useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem
                    className="w-full"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpen(true);
                    }}
                >
                    Track
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent >
                <DialogHeader>
                    <DialogTitle>Create Track</DialogTitle>
                    <DialogDescription>
                        Create a track for this mission
                    </DialogDescription>
                </DialogHeader>
                <div className='max-h-[80vh] py-4 overflow-y-auto'>
                <TrackCreate missionId={mission.id} />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateTrackButton