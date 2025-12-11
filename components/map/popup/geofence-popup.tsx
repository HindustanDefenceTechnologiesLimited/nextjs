import { Geofence } from '@/lib/types'
import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Edit2Icon, Trash2Icon, VectorSquareIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from "@/components/ui/badge"
import api from '@/lib/auth'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteGeofence } from '@/store/slices/missionSlice'
import { useAppDispatch } from '@/store/hook'
import { PopoverClose } from '@radix-ui/react-popover'
type Props = {
    geofence: Geofence
}

const GeofencePopup = ({ geofence }: Props) => {
    const geo = geofence.geometry;
    const dispatch = useAppDispatch();
    const handleDelete = async () => {
        try {
            const res = await api.delete('/api/geofence/delete/' + geofence.id);
            if (res.status === 200) {
                toast.success('Geofence deleted successfully.');
                dispatch(deleteGeofence(geofence.id));
            } else {
                toast.error("Failed to delete geofence");
            }
        } catch (error) {
            toast.error("Error deleting geofence:");
        }
    }
    return (
        <Popover>
            <PopoverTrigger
                data-type={geo.shapeType}
                className='-translate-y-[60%] data-[type=rectangle]:translate-x-[50%]'
            >
                <div className='cursor-pointer text-white font-light text-[11px] bg-blue-600 px-1 rounded flex items-center gap-1'>
                    <VectorSquareIcon className='w-3 h-3 aspect-square' />
                    {geofence.name}
                </div>
            </PopoverTrigger>

            <PopoverContent side='top' align='start' className='p-2 w-64 space-y-2'>

                {/* ACTIONS */}
                <div className='flex items-center gap-1'>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant='destructive' size='icon-sm'>
                                <Trash2Icon className='w-4 h-4' />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your geofence.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <PopoverClose>
                                <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                                </PopoverClose>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Button variant='ghost' size='icon-sm'>
                        <Edit2Icon className='w-4 h-4' />
                    </Button>
                </div>

                <Separator />

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold truncate">{geofence.name}</p>
                    <Badge variant="outline" className="text-[10px]">
                        {geofence.type}
                    </Badge>
                </div>

                {/* COMPACT GRID */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">

                    {/* Shape */}
                    <div>
                        <p className="text-muted-foreground">Shape</p>
                        <p className="font-medium">{geo.shapeType}</p>
                    </div>

                    {/* Active */}
                    <div>
                        <p className="text-muted-foreground">Status</p>
                        <Badge
                            className="text-[10px] px-1"
                            variant={geofence.isActive ? "default" : "secondary"}
                        >
                            {geofence.isActive ? "Active" : "Inactive"}
                        </Badge>
                    </div>

                    {/* Mission */}
                    <div>
                        <p className="text-muted-foreground">Mission</p>
                        <p className="font-medium truncate">{geofence.missionId}</p>
                    </div>

                    {/* Description */}
                    {geofence.description && (
                        <div>
                            <p className="text-muted-foreground">Desc</p>
                            <p className="font-medium truncate">{geofence.description}</p>
                        </div>
                    )}

                    {/* Geometry-specific details */}
                    {geo.shapeType === "circle" && (
                        <>
                            <div>
                                <p className="text-muted-foreground">Center</p>
                                <p className="font-medium truncate">
                                    {geo.center?.lng.toFixed(4)}, {geo.center?.lat.toFixed(4)}
                                </p>
                            </div>

                            <div>
                                <p className="text-muted-foreground">Radius</p>
                                <p className="font-medium">{geo.radius ?? geofence.radius} m</p>
                            </div>
                        </>
                    )}

                    {geo.shapeType === "rectangle" && (
                        <>
                            <div>
                                <p className="text-muted-foreground">Coordinates</p>
                                <p className="font-medium truncate">
                                    {geo.coordinates.length} pts
                                </p>
                            </div>
                        </>
                    )}

                    {/* Altitude */}
                    {(geo.altitude || geofence.altitude) && (
                        <div>
                            <p className="text-muted-foreground">Altitude</p>
                            <p className="font-medium">
                                {geo.altitude ?? geofence.altitude} m
                            </p>
                        </div>
                    )}
                </div>

                {/* Metadata */}
                {geofence.metadata && Object.keys(geofence.metadata).length > 0 && (
                    <>
                        <Separator />
                        <div className="text-[11px]">
                            <p className="text-muted-foreground">Metadata</p>
                            <pre className="text-[10px] bg-muted p-1 rounded max-h-20 overflow-auto">
                                {JSON.stringify(geofence.metadata, null, 1)}
                            </pre>
                        </div>
                    </>
                )}

            </PopoverContent>
        </Popover>
    )
}

export default GeofencePopup
