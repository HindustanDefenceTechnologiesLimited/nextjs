import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import maplibregl from "maplibre-gl";
import { Track } from "@/lib/types";
import { useMap } from "../map-context";
import TrackPopup from "../../popup/track-popup";

type Props = {
  tracks: Track[];
};

export default function TrackMarkerLayer({ tracks }: Props) {
  const map = useMap();

  const markersRef = useRef<maplibregl.Marker[]>([]);
  const rootsRef = useRef<any[]>([]);

  useEffect(() => {
        if (!map) return;
    // cleanup
    rootsRef.current.forEach((r) => r.unmount());
    rootsRef.current = [];

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    tracks.forEach((track) => {
      if (!track.positions?.length) return;

      const container = document.createElement("div");
      const root = createRoot(container);
      root.render(<TrackPopup track={track} />);

      const pos = track.positions[0];

      const marker = new maplibregl.Marker({
        element: container,
        anchor: "center",
        rotation: pos.heading,
        rotationAlignment: "map",
      })
        .setLngLat([pos.longitude, pos.latitude])
        .addTo(map);

      rootsRef.current.push(root);
      markersRef.current.push(marker);
    });

    return () => {
      rootsRef.current.forEach((r) => r.unmount());
      markersRef.current.forEach((m) => m.remove());
      rootsRef.current = [];
      markersRef.current = [];
    };
  }, [tracks, map]);

  return null;
}
