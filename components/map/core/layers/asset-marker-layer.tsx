import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import maplibregl from "maplibre-gl";
import { Asset, Track } from "@/lib/types";
import { useMap } from "../map-context";
import ReduxProvider from "@/components/provider/redux-provider";
import AssetPopup from "../../popup/asset-popup";

type Props = {
  assets: Asset[];
};

export default function AssetMarkerLayer({ assets }: Props) {
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
  }, [assets, map]);

  /* -------------------------
     Initialize markers
  -------------------------- */
  function init() {
    assets.forEach((asset) => {
      if (!asset.positions?.length) return;

      const container = document.createElement("div");
      const root = createRoot(container);
      root.render(
        <ReduxProvider>
          <AssetPopup asset={asset} />
        </ReduxProvider>
      );

      const pos = asset.positions[0];

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
