import { Button } from "../../../../ui/button";
import { CircleCheckBigIcon, LocateFixedIcon, MessageCirclePlusIcon, PlusIcon } from "lucide-react";
import { useMap } from "../../map-context";
import { useAppSelector } from "@/store/hook";
import { RootState } from "@/store/store";
import { useAppDispatch } from "@/store/hook";
import { setMapData, setMapType, setRouteFocusData, setRouteFocusEntity } from "@/store/slices/mapSlice";
import { useEffect, useState } from "react";
import { set } from "date-fns";
import { toast } from "sonner";
import api from "@/lib/auth";
import { title } from "process";
import { addAnnotation, addObjective } from "@/store/slices/missionSlice";
import { ObjectiveStatus, ObjectiveType } from "@/lib/types";
import DirectionsToolbar from "../directions-toolbar";
import AddTrackPosition from "./add-track-position";
import AddAssetPosition from "./add-asset-position";

type Props = {};

const MapToolbar = (props: Props) => {
  const map = useMap();
  const mission = useAppSelector((state: RootState) => state.mission.data);
  const dispatch = useAppDispatch();
  const [addElementClicked, setAddElementClicked] = useState(false);
  const handleResetMapCenter = () => {
    if (!mission.mapCoordinates) return;
    map?.flyTo({
      center: [
        mission.mapCoordinates?.center.lng,
        mission.mapCoordinates?.center.lat,
      ],
      zoom: mission.mapCoordinates?.zoom,
      curve: 1,
      bearing: 0,
      pitch: 0,
    });
  };

  const handleAddMapElement = (type: 'annotation' | 'objective') => {
    setAddElementClicked(true);
    map.getCanvas().style.cursor = 'crosshair';
    toast.loading('Click on the map to add an ' + type, {
      id: 'add-' + type,
    });
    map?.once("click", (e) => {
      const { lng, lat } = e.lngLat;
      map.getCanvas().style.removeProperty('cursor');
      toast.dismiss('add-' + type)
      if (type === 'annotation') {
        createMapAnnotation(lng, lat)
      } else if (type === 'objective') {
        createMapObjective(lng, lat)
      }
      setAddElementClicked(false)
      return
    })
  }
  const createMapAnnotation = async (lng: number, lat: number) => {
    try {
      const res = await api.post('/api/annotation/create', {
        missionId: mission.id,
        location: { lng, lat },
        title: 'Untitled Annotation',
        type: 'MAP',
      })
      if (res.data.success) {
        toast.success("Annotation added successfully!");
        dispatch(addAnnotation(res.data.data));
      }
    } catch (error) {
      toast.error("Failed to add annotation");
    }
  }
  const createMapObjective = async (lng: number, lat: number) => {
    try {
      const res = await api.post('/api/objective/create', {
        missionId: mission.id,
        location: { lng, lat },
        title: 'Untitled Objective',
        type: ObjectiveType.TASK,
        status: ObjectiveStatus.NEW
      })
      if (res.data.success) {
        toast.success("Objective added successfully!");
        dispatch(addObjective(res.data.data));

      }

    } catch (error) {

    }
  }
  return (
    <div className="flex absolute top-2 left-2 z-9 backdrop-blur bg-secondary rounded-md gap-1 p-1">
      <Button
        size="icon-sm"
        className="w-6 h-6 bg-background hover:bg-background/60 text-foreground"
        onClick={handleResetMapCenter}
      >
        <LocateFixedIcon className="w-3 h-3" />
      </Button>
      <Button
        size="sm"
        className="h-6 text-xs bg-background hover:bg-background/60 text-foreground"
        onClick={() => {
          dispatch(setMapType(null));
          dispatch(setMapData(null));
          dispatch(setRouteFocusData([]));
          dispatch(setRouteFocusEntity(null));
        }}
      >
        Clear focus
      </Button>
      <Button
        size="sm"
        className="h-6 text-xs bg-background hover:bg-background/60 text-foreground"
        onClick={() => handleAddMapElement('annotation')}
        disabled={addElementClicked}
      >
        <MessageCirclePlusIcon className="w-3 h-3" />
        Annotate
      </Button>
      <Button
        size="sm"
        className="h-6 text-xs bg-background hover:bg-background/60 text-foreground"
        onClick={() => handleAddMapElement('objective')}
        disabled={addElementClicked}
      >
        <CircleCheckBigIcon className="w-3 h-3" />
        Objective
      </Button>
      <AddTrackPosition
        addElementClicked={addElementClicked}
        setAddElementClicked={setAddElementClicked}
      />
      <AddAssetPosition
        addElementClicked={addElementClicked}
        setAddElementClicked={setAddElementClicked}
      />
      <DirectionsToolbar />
    </div>
  );
};

export default MapToolbar;
