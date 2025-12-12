import { Button } from "../../ui/button";
import { LocateFixedIcon } from "lucide-react";
import { useMap } from "./map-context";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAppDispatch } from "@/store/hook";
import { setMapData, setMapType, setRouteFocusData, setRouteFocusEntity } from "@/store/slices/mapSlice";

type Props = {};

const MapToolbar = (props: Props) => {
  const map = useMap();
  const mission = useSelector((state: RootState) => state.mission.data);
  const dispatch = useAppDispatch();
  const handleResetMapCenter = () => {
    if (!mission.mapCoordinates) return;
    map?.flyTo({
      center: [
        mission.mapCoordinates?.center.lng,
        mission.mapCoordinates?.center.lat,
      ],
      zoom: 15,
      curve: 1,
      bearing: 0,
      pitch: 0,
    });
  };
  return (
    <div className="flex absolute top-2 left-2 z-9 backdrop-blur rounded-md gap-1 p-1">
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
        onClick={()=>{
          dispatch(setMapType(null));
          dispatch(setMapData(null));
          dispatch(setRouteFocusData([]));
          dispatch(setRouteFocusEntity(null));

        }}
      >
        Clear focus
      </Button>
    </div>
  );
};

export default MapToolbar;
