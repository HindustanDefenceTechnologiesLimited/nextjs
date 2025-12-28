import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { useMap } from "../map-context";
import { useAppSelector } from "@/store/hook";
import { RootState } from "@/store/store";
import { Asset, AssetPosition, Geofence, TrackPosition } from "@/lib/types";

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

    case "assetPosition": {
      const pos = data as AssetPosition;
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
      const asset = data as Asset;
      const positions = asset.positions || [];
      if(positions.length === 0) return null;
      if(positions == undefined)  return null;

      return {
        lng: positions[0].longitude,
        lat: positions[0].latitude,
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

  const focusType = useAppSelector((state: RootState) => state.map.type);
  const focusData = useAppSelector((state: RootState) => state.map.data);

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
