import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import maplibregl from "maplibre-gl";
import { Track } from "@/lib/types";
import { useMap } from "../map-context";
import TrackPopup from "../../popup/track-popup";
import ReduxProvider from "@/components/provider/redux-provider";

type Props = {
  tracks: Track[];
};

export default function TrackMarkerLayer({ tracks }: Props) {
  const map = useMap();

  const markersRef = useRef<maplibregl.Marker[]>([]);
  const rootsRef = useRef<any[]>([]);

  useEffect(() => {
    if (!map) return;

    const run = () => {
      init();
    };

    if (!map.isStyleLoaded()) {
      map.once("load", run);
    } else {
      run();
    }

    return () => {
      cleanup();
      map.off("load", run);
    };
  }, [tracks, map]);


  function init() {
    tracks.forEach((track) => {
      if (!track.positions?.length) return;

      const container = document.createElement("div");
      const root = createRoot(container);
      root.render(
        <ReduxProvider>
          <TrackPopup track={track} />
        </ReduxProvider>
      );

      const pos = track.positions[0];

      const marker = new maplibregl.Marker({
        element: container,
        anchor: "center",
        rotationAlignment: "map",
        pitchAlignment: "viewport",
      })
        .setLngLat([pos.longitude, pos.latitude])
        .addTo(map);

      rootsRef.current.push(root);
      markersRef.current.push(marker);
    });
  }

  function cleanup() {
    const roots = rootsRef.current;
    const markers = markersRef.current;

    rootsRef.current = [];
    markersRef.current = [];

    queueMicrotask(() => {
      roots.forEach((r) => r.unmount());
      markers.forEach((m) => m.remove());
    });
  }

  return null;
}
