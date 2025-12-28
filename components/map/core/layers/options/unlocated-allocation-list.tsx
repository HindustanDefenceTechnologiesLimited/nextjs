import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { RootState } from "@/store/store"
import { stat } from "fs"
import { MapPinPlusIcon } from "lucide-react"
import { useMap } from "../../map-context"
import { useState } from "react"
import { toast } from "sonner"
import { updateObjective } from "@/store/slices/missionSlice"
import { Objective } from "@/lib/types"

export const UnlocatedObjectives = () => {
    const mission = useAppSelector((state: RootState) => state.mission.data)
    const map = useMap();
    const dispatch = useAppDispatch();
    const [addElementClicked, setAddElementClicked] = useState(false);
    const unlocatedObjectives = mission.objectives?.filter((objective) => !objective.location);

    const handleAddMapElement = (objective: Objective) => {
        setAddElementClicked(true);
        map.getCanvas().style.cursor = 'crosshair';
        toast.loading('Click on the map to add location to the objective.', {
            id: 'add-location',
        });
        map?.once("click", (e) => {
            const { lng, lat } = e.lngLat;
            map.getCanvas().style.removeProperty('cursor');
            toast.dismiss('add-location')
            dispatch(updateObjective({ id: objective.id, location: { lng, lat } })   )
            setAddElementClicked(false)
            return
        })
    }
    return (
        <div className='flex flex-col gap-2'>
            {
                unlocatedObjectives?.map((objective: Objective) => {
                    return (
                        <div key={objective.id} className='flex justify-between items-center rounded hover:bg-secondary px-2 py-1/2'>
                            <div>
                                <p className='text-sm truncate'>{objective.title}</p>
                                <p className='text-xs text-muted-foreground truncate'>{objective.description}</p>
                            </div>
                            <Button size='icon-sm' variant='secondary' className="w-6 h-6" onClick={()=>handleAddMapElement(objective)}>
                                <MapPinPlusIcon className='w-4 h-4' />
                            </Button>
                        </div>
                    )
                })
            }
        </div>
    )
}