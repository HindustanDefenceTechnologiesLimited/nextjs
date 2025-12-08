import { useEffect } from "react";
import maplibregl, { GeoJSONSource } from "maplibre-gl";
import { useMap } from "../map-context";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function RouteLayer() {
  const map = useMap();
  const positions = useSelector(
    (state: RootState) => state.map.routeFocusData
  );
  const positionEntity = useSelector(
    (state: RootState) => state.map.routeFocusEntity
  );

useEffect(() => {
  if (!map || !positions || positions.length < 2 || !positionEntity) return;

  const sourceId = `route-${positionEntity.id}-source`;
  const lineLayerId = `route-${positionEntity.id}-line`;
  const arrowLayerId = `route-${positionEntity.id}-arrows`;
  const pointLayerId = `route-${positionEntity.id}-points`;

  const geojson: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: positions.map(p => [p.longitude, p.latitude]),
        },
        properties: {},
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [positions[0].longitude, positions[0].latitude],
        },
        properties: { kind: "start" },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [
            positions[positions.length - 1].longitude,
            positions[positions.length - 1].latitude,
          ],
        },
        properties: { kind: "end" },
      },
    ],
  };

  const addLayers = () => {
    if (!map || map.getSource(sourceId)) {
      (map.getSource(sourceId) as GeoJSONSource | undefined)?.setData(geojson);
      return;
    }

    map.addSource(sourceId, {
      type: "geojson",
      data: geojson,
    });

    map.addLayer({
      id: lineLayerId,
      type: "line",
      source: sourceId,
      filter: ["==", ["geometry-type"], "LineString"],
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#fff",
        "line-width": 4,
        "line-opacity": 0.9,
      },
    });

    map.addLayer({
      id: arrowLayerId,
      type: "symbol",
      source: sourceId,
      filter: ["==", ["geometry-type"], "LineString"],
      layout: {
        "symbol-placement": "line",
        "symbol-spacing": 80,
        "icon-image": "triangle-11",
        "icon-rotate": 90,
        "icon-rotation-alignment": "map",
        "icon-allow-overlap": true,
        "icon-size": 0.8,
      },
      paint: {
        "icon-color": "#ffffff",
      },
    });

    map.addLayer({
      id: pointLayerId,
      type: "circle",
      source: sourceId,
      filter: ["==", ["geometry-type"], "Point"],
      paint: {
        "circle-radius": [
          "match",
          ["get", "kind"],
          "start",
          6,
          "end",
          6,
          4,
        ],
        "circle-color": [
          "match",
          ["get", "kind"],
          "start",
          "#22c55e",
          "end",
          "#ef4444",
          "#ffffff",
        ],
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    });
  };

  if (map.isStyleLoaded()) {
    addLayers();
  } else {
    map.once("style.load", addLayers);
  }

  return () => {
    if (!map || !map.isStyleLoaded()) return;

    [pointLayerId, arrowLayerId, lineLayerId].forEach(id => {
      if (map.getLayer(id)) map.removeLayer(id);
    });

    if (map.getSource(sourceId)) map.removeSource(sourceId);
  };
}, [map, positions, positionEntity]);


  return null;
}
