"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { Geofence } from "@/lib/types";
import { useMap } from "../map-context";
import { createRoot, Root } from "react-dom/client";

import GeofencePopup from "../../popup/geofence-popup";
import ReduxProvider from "@/components/provider/redux-provider";

const GEOFENCE_COLORS: Record<string, string> = {
  SAFE_ZONE: "#22c55e",
  EXCLUSION: "#00f7ff",
  INCLUSION: "#ff00fb",
  ALERT_ZONE: "#ffaa00",
  RESTRICTED_AREA: "#ff0000",
};

type PopupMarker = {
  marker: maplibregl.Marker;
  root: Root;
};

type Props = {
  geofences: Geofence[];
};

export default function GeofenceShapeLayer({ geofences }: Props) {
  const map = useMap();
  const popupMarkersRef = useRef<PopupMarker[]>([]);
const isUnmountingRef = useRef(false);

  /* ------------------------------------------------
     INIT
  ------------------------------------------------- */
useEffect(() => {
  if (!map) return;

  isUnmountingRef.current = false;

  const run = () => initLayer();

  if (!map.isStyleLoaded()) {
    map.once("load", run);
  } else {
    run();
  }

  return () => {
    isUnmountingRef.current = true;
    cleanup();
    map.off("load", run);
  };
}, [map, geofences]);


  /* ------------------------------------------------
     INIT LAYER
  ------------------------------------------------- */
  function initLayer() {
    cleanup();

    geofences.forEach((g) => {
      const sourceId = `geofence-source-${g.id}`;
      const fillLayerId = `geofence-layer-${g.id}`;
      const outlineLayerId = `${fillLayerId}-outline`;

      const geometry = buildGeometry(g);
      if (!geometry) return;

      map.addSource(sourceId, {
        type: "geojson",
        data: {
          type: "Feature",
          geometry,
          properties: {},
        },
      });

      map.addLayer({
        id: fillLayerId,
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": GEOFENCE_COLORS[g.type] ?? "#3b82f6",
          "fill-opacity": 0.1,
        },
      });

      map.addLayer({
        id: outlineLayerId,
        type: "line",
        source: sourceId,
        paint: {
          "line-color": GEOFENCE_COLORS[g.type] ?? "#3b82f6",
          "line-width": 1,
          "line-dasharray":
            g.type === "RESTRICTED_AREA" || g.type === "ALERT_ZONE"
              ? [5, 8]
              : [1, 0],
        },
      });

      /* ---------- Popup marker ---------- */
      const el = document.createElement("div");
      const root = createRoot(el);

      root.render(
        <ReduxProvider>
          <GeofencePopup geofence={g} />
        </ReduxProvider>
      );

      const marker = new maplibregl.Marker({
        element: el,
        anchor: "center",
      })
        .setLngLat(getTopLeftCoordinate(geometry))
        .addTo(map);

      popupMarkersRef.current.push({ marker, root });
    });
  }

  /* ------------------------------------------------
     CLEANUP (CRITICAL)
  ------------------------------------------------- */
function cleanup() {
  if (!map || !map.isStyleLoaded()) return;

  /* 1️⃣ Remove MapLibre markers (safe) */
  popupMarkersRef.current.forEach(({ marker }) => {
    try {
      marker.remove();
    } catch {}
  });

  /* 2️⃣ Defer React unmount (CRITICAL) */
  popupMarkersRef.current.forEach(({ root }) => {
    try {
      queueMicrotask(() => {
        if (!isUnmountingRef.current) {
          root.unmount();
        }
      });
    } catch {}
  });

  popupMarkersRef.current = [];

  /* 3️⃣ Remove layers & sources */
  geofences.forEach((g) => {
    const sourceId = `geofence-source-${g.id}`;
    const fillLayerId = `geofence-layer-${g.id}`;
    const outlineLayerId = `${fillLayerId}-outline`;

    try {
      if (map.getLayer(outlineLayerId)) map.removeLayer(outlineLayerId);
      if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    } catch {
      // map already destroyed — ignore
    }
  });
}


  return null;
}

/* ------------------------------------------------
   HELPERS
------------------------------------------------- */

function rectangleToPolygon(coords: number[][]): GeoJSON.Polygon {
  const [sw, ne] = coords;
  return {
    type: "Polygon",
    coordinates: [[
      [sw[0], sw[1]],
      [ne[0], sw[1]],
      [ne[0], ne[1]],
      [sw[0], ne[1]],
      [sw[0], sw[1]],
    ]],
  };
}

function circleToPolygon(
  center: [number, number],
  radius: number,
  steps = 64
): GeoJSON.Polygon {
  const [lng, lat] = center;
  const coords: number[][] = [];
  const R = 6378137;

  for (let i = 0; i <= steps; i++) {
    const a = (i * 2 * Math.PI) / steps;
    const dx = radius * Math.cos(a);
    const dy = radius * Math.sin(a);

    coords.push([
      lng + ((dx / R) * 180) / Math.PI / Math.cos((lat * Math.PI) / 180),
      lat + ((dy / R) * 180) / Math.PI,
    ]);
  }

  return { type: "Polygon", coordinates: [coords] };
}

function buildGeometry(g: Geofence): GeoJSON.Polygon | null {
  if (g.geometry.shapeType === "rectangle") {
    return rectangleToPolygon(g.geometry.coordinates);
  }

  if (g.geometry.shapeType === "circle" && g.geometry.radius) {
    return circleToPolygon(
      g.geometry.coordinates[0] as [number, number],
      g.geometry.radius
    );
  }

  return null;
}

function getTopLeftCoordinate(poly: GeoJSON.Polygon): [number, number] {
  return poly.coordinates[0].reduce(
    (best, cur) =>
      cur[1] > best[1] || (cur[1] === best[1] && cur[0] < best[0])
        ? cur
        : best,
    poly.coordinates[0][0]
  ) as [number, number];
}
