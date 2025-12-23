import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import maplibregl from "maplibre-gl";
import { Annotation } from "@/lib/types";
import { useMap } from "../map-context";
import ReduxProvider from "@/components/provider/redux-provider";
import AnnotationPopup from "../../popup/annotation-popup";

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
          <AnnotationPopup annotation={annotation} />
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
