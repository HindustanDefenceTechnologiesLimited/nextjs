import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { useMap } from "../map-context";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { TrackPosition } from "@/lib/types";

export default function FocusMarkerLayer() {
  const map = useMap();
  const focusMarkerRef = useRef<maplibregl.Marker | null>(null);

  const mapFocusType = useSelector((state: RootState) => state.map.type);
  const mapFocusData = useSelector((state: RootState) => state.map.data);

  useEffect(() => {
    if (mapFocusType !== "trackPosition") return;

    const pos = mapFocusData as TrackPosition;

    if (focusMarkerRef.current) {
      focusMarkerRef.current.remove();
      focusMarkerRef.current = null;
    }

    const marker = new maplibregl.Marker()
      .setLngLat([pos.longitude, pos.latitude])
      .addTo(map);

    focusMarkerRef.current = marker;

    map.easeTo({
      center: [pos.longitude, pos.latitude],
      zoom: 15,
      duration: 800,
    });
  }, [mapFocusType, mapFocusData, map]);

  useEffect(() => {
    return () => {
      focusMarkerRef.current?.remove();
      focusMarkerRef.current = null;
    };
  }, [map]);

  return null;
}
