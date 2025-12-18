import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import maplibregl from "maplibre-gl";
import { Annotation } from "@/lib/types";
import { useMap } from "../map-context";
import ReduxProvider from "@/components/provider/redux-provider";

type Props = {
  annotations: Annotation[];
};

export default function AnnotationMarkerLayer({ annotations }: Props) {
  const map = useMap();

  const markersRef = useRef<maplibregl.Marker[]>([]);
  const rootsRef = useRef<any[]>([]);

  useEffect(() => {
    if (!map) return;

    const run = () => {
      cleanup();
      init();
    };

    // If style is not loaded, wait for it
    if (!map.isStyleLoaded()) {
      map.once("load", run);
      return () => map.off("load", run);
    }

    // Style already loaded → run immediately
    run();

    return () => {
      // queueMicrotask(() => cleanup());
    };
  }, [annotations, map]);

  /* -------------------------
     Initialize markers
  -------------------------- */
  function init() {
    annotations.forEach((annotation) => {
      if (annotation.type !== "MAP" || !annotation.location) return;

      const container = document.createElement("div");
      const root = createRoot(container);
      root.render(
        <ReduxProvider>
          <p className="text-white">{annotation.title}</p>
        </ReduxProvider>
      );

      const pos = annotation.location;

      const marker = new maplibregl.Marker({
        element: container,
        anchor: "center",
        rotationAlignment: "map",
        pitchAlignment: "viewport",
      })
        .setLngLat([pos.lng, pos.lat])
        .addTo(map);

      rootsRef.current.push(root);
      markersRef.current.push(marker);
    });
  }

  /* -------------------------
     Cleanup markers + roots
  -------------------------- */
  function cleanup() {
    try {
      rootsRef.current.forEach((r) => r.unmount());
      markersRef.current.forEach((m) => m.remove());
    } catch (e) {
      // ignore cleanup errors when map is already destroyed
    }

    rootsRef.current = [];
    markersRef.current = [];
  }

  return null;
}
