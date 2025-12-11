import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { useMap } from "../map-context";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Geofence, TrackPosition } from "@/lib/types";

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */

type FocusResult = {
  lng: number;
  lat: number;
} | null;

function resolveFocusCenter(
  type: RootState["map"]["type"],
  data: RootState["map"]["data"]
): FocusResult {
  if (!type || !data) return null;

  switch (type) {
    case "trackPosition": {
      const pos = data as TrackPosition;
      return {
        lng: pos.longitude,
        lat: pos.latitude,
      };
    }

    case "geofence": {
      const fence = data as Geofence;
      return {
        lng: fence.geometry.center?.lng || 0,
        lat: fence.geometry.center?.lat || 0,
      };
    }

    case "asset": {
      const asset = data as {
        location?: { lng: number; lat: number };
      };

      if (!asset.location) return null;

      return {
        lng: asset.location.lng,
        lat: asset.location.lat,
      };
    }
    case null:
      return null;
    default:
      return null;
  }
}

/* -------------------------------------------------------
   Component
------------------------------------------------------- */

export default function FocusMarkerLayer() {
  const map = useMap();
  const markerRef = useRef<maplibregl.Marker | null>(null);

  const focusType = useSelector((state: RootState) => state.map.type);
  const focusData = useSelector((state: RootState) => state.map.data);

  useEffect(() => {
    if (!map) return;
    const center = resolveFocusCenter(focusType, focusData);
    if (center == null) {
      markerRef.current?.remove();
      return;
    };
    // Remove old marker
    markerRef.current?.remove();

    // Create new marker
    markerRef.current = new maplibregl.Marker()
      .setLngLat([center.lng, center.lat])
      .addTo(map);

    // Smooth focus movement
    map.easeTo({
      center: [center.lng, center.lat],
      zoom: 15,
      duration: 800,
    });
  }, [map, focusType, focusData]);

  useEffect(() => {
    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
    };
  }, [map]);

  return null;
}
