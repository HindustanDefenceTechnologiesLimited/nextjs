import { createContext, useContext } from "react";
import maplibregl from "maplibre-gl";

export const MapContext = createContext<maplibregl.Map | null>(null);

export const useMap = () => {
  const map = useContext(MapContext);
  if (!map) throw new Error("useMap must be used inside MapContext");
  return map;
};
