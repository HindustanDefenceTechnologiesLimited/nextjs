import { useEffect, useRef } from "react";
import maplibregl, { GeoJSONSource } from "maplibre-gl";
import { Geofence } from "@/lib/types";
import { useMap } from "../map-context";
import { createRoot } from "react-dom/client";

// Your external component
import GeofencePopup from "../../popup/geofence-popup";

const GEOFENCE_COLORS = {
  SAFE_ZONE: "#22c55e",
  EXCLUSION: "#00f7ff",
  INCLUSION: "#ff00fb",
  ALERT_ZONE: "#ffaa00",
  RESTRICTED_AREA: "#ff0000",
};

function rectangleToPolygon(coords: number[][]): GeoJSON.Polygon {
  const [sw, ne] = coords;

  return {
    type: "Polygon",
    coordinates: [
      [
        [sw[0], sw[1]],
        [ne[0], sw[1]],
        [ne[0], ne[1]],
        [sw[0], ne[1]],
        [sw[0], sw[1]],
      ],
    ],
  };
}

function circleToPolygon(
  center: [number, number],
  radiusMeters: number,
  steps = 64
): GeoJSON.Polygon {
  const coords: number[][] = [];
  const [lng, lat] = center;
  const earthRadius = 6378137;

  for (let i = 0; i <= steps; i++) {
    const angle = (i * 2 * Math.PI) / steps;
    const dx = radiusMeters * Math.cos(angle);
    const dy = radiusMeters * Math.sin(angle);

    const newLng =
      lng +
      ((dx / earthRadius) * (180 / Math.PI)) / Math.cos((lat * Math.PI) / 180);
    const newLat = lat + (dy / earthRadius) * (180 / Math.PI);

    coords.push([newLng, newLat]);
  }

  return { type: "Polygon", coordinates: [coords] };
}

/* -------------------------------------------------------
   Get NORTH-WEST (top-left) coordinate of polygon
------------------------------------------------------- */
function getTopLeftCoordinate(poly: GeoJSON.Polygon): [number, number] {
  const coords = poly.coordinates[0];
  let topLeft = coords[0];

  coords.forEach((c) => {
    const [lng, lat] = c;

    // "Top" → highest latitude
    // "Left" → lowest longitude
    if (lat > topLeft[1] || (lat === topLeft[1] && lng < topLeft[0])) {
      topLeft = c;
    }
  });

  return topLeft as [number, number];
}

/* -------------------------------------------------------
   Component
------------------------------------------------------- */

type Props = {
  geofences: Geofence[];
};

export default function GeofenceShapeLayer({ geofences }: Props) {
  const map = useMap();
  const markerRefs = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!map) return;

    // Cleanup old markers
    markerRefs.current.forEach((m) => m.remove());
    markerRefs.current = [];

    // Cleanup old layers & sources
    geofences.forEach((g) => {
      const layerId = `geofence-layer-${g.id}`;
      const sourceId = `geofence-source-${g.id}`;

      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getLayer(`${layerId}-outline`))
        map.removeLayer(`${layerId}-outline`);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    });

    geofences.forEach((g) => {
      const sourceId = `geofence-source-${g.id}`;
      const layerId = `geofence-layer-${g.id}`;

      let geometry: GeoJSON.Polygon | null = null;

      if (g.geometry.shapeType === "rectangle") {
        geometry = rectangleToPolygon(g.geometry.coordinates);
      }

      if (g.geometry.shapeType === "circle" && g.radius) {
        geometry = circleToPolygon(
          g.geometry.coordinates[0] as [number, number],
          g.radius
        );
      }

      if (!geometry) return;

      /* Add GeoJSON source */
      map.addSource(sourceId, {
        type: "geojson",
        data: {
          type: "Feature",
          geometry,
          properties: { type: g.type },
        },
      });

      /* Fill layer */
      map.addLayer({
        id: layerId,
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": GEOFENCE_COLORS[g.type] ?? "#3b82f6",
          "fill-opacity": 0.1,
        },
      });

      /* Outline layer */
      map.addLayer({
        id: `${layerId}-outline`,
        type: "line",
        source: sourceId,
        paint: {
          "line-color": GEOFENCE_COLORS[g.type] ?? "#3b82f6",
          "line-width": 1,
          "line-dasharray": (g.type === 'RESTRICTED_AREA' || g.type === 'ALERT_ZONE') ? [5, 8] : [1, 0],
        },
      });

      /* -------------------------------------------------------
         ADD REACT COMPONENT MARKER AT TOP-LEFT
      ------------------------------------------------------- */
      const topLeft = getTopLeftCoordinate(geometry);

      const el = document.createElement("div");
      el.style.width = "auto";
      el.style.height = "auto";
      el.style.transform = "translate(100%, -100%)"
      const root = createRoot(el);
      root.render(<GeofencePopup geofence={g} />);

      const marker = new maplibregl.Marker({
        element: el,
        anchor: "center",
        // rotation: 0,
        rotationAlignment: "map",
        pitchAlignment: "viewport",
      })
        .setLngLat(topLeft)
        .addTo(map);

      markerRefs.current.push(marker);
    });

    return () => {
      markerRefs.current.forEach((m) => m.remove());
      markerRefs.current = [];

      geofences.forEach((g) => {
        const layerId = `geofence-layer-${g.id}`;
        const sourceId = `geofence-source-${g.id}`;

        if (map.getLayer(`${layerId}-outline`))
          map.removeLayer(`${layerId}-outline`);
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      });
    };
  }, [map, geofences]);

  return null;
}
