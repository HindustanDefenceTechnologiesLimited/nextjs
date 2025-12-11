import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { RotateCw } from "lucide-react";

type Props = {
  onSelect: (lng: number, lat: number, radius: number) => void;
  center?: [number, number];
};

/* 🔧 helpers */
function toRad(d: number) {
  return (d * Math.PI) / 180;
}

function haversine(
  lng1: number,
  lat1: number,
  lng2: number,
  lat2: number
) {
  const R = 6371000; // meters
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function createCircle(
  lng: number,
  lat: number,
  radius: number,
  steps = 64
) {
  const coords: number[][] = [];
  const R = 6371000;

  for (let i = 0; i <= steps; i++) {
    const angle = (i * 2 * Math.PI) / steps;
    const dx = radius * Math.cos(angle);
    const dy = radius * Math.sin(angle);

    const newLat = lat + (dy / R) * (180 / Math.PI);
    const newLng =
      lng +
      ((dx / R) * (180 / Math.PI)) / Math.cos(toRad(lat));

    coords.push([newLng, newLat]);
  }

  return coords;
}

const MapCircleSelector = ({
  onSelect,
  center = [73.8567, 18.5204],
}: Props) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const centerMarkerRef = useRef<maplibregl.Marker | null>(null);

  const [circle, setCircle] = useState({
    lng: 0,
    lat: 0,
    radius: 0,
  });

  const resetSelection = () => {
    centerMarkerRef.current?.remove();
    centerMarkerRef.current = null;

    const map = mapRef.current;
    if (!map) return;

    const source = map.getSource("circle") as maplibregl.GeoJSONSource;
    source?.setData({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [],
      },
      properties: {},
    });

    setCircle({ lng: 0, lat: 0, radius: 0 });
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "http://localhost:8080/styles/dark/style.json",
      center,
      zoom: 15,
    });

    mapRef.current = map;

    map.on("load", () => {
      map.addSource("circle", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "Polygon", coordinates: [] },
          properties: {},
        },
      });

      map.addLayer({
        id: "circle-fill",
        type: "fill",
        source: "circle",
        paint: {
          "fill-color": "#16a34a",
          "fill-opacity": 0.25,
        },
      });

      map.addLayer({
        id: "circle-outline",
        type: "line",
        source: "circle",
        paint: {
          "line-color": "#4ade80",
          "line-width": 2,
        },
      });

      map.on("click", (e) => {
        const { lng, lat } = e.lngLat;

        /* ✅ THIRD CLICK → RESET */
        if (centerMarkerRef.current && circle.radius) {
          resetSelection();
        }

        /* ✅ FIRST CLICK → CENTER */
        if (!centerMarkerRef.current) {
          centerMarkerRef.current = new maplibregl.Marker({ color: "green" })
            .setLngLat([lng, lat])
            .addTo(map);

          setCircle((p) => ({ ...p, lng, lat }));
          return;
        }

        /* ✅ SECOND CLICK → RADIUS */
        if (!circle.radius) {
          const { lng: cLng, lat: cLat } =
            centerMarkerRef.current.getLngLat();

          const radius = haversine(cLng, cLat, lng, lat);

          if (radius < 10) {
            toast.error("Radius is too small");
            return;
          }

          const circleCoords = createCircle(
            cLng,
            cLat,
            radius
          );

          const source = map.getSource("circle") as maplibregl.GeoJSONSource;
          source?.setData({
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [circleCoords],
            },
            properties: {},
          });

          setCircle({ lng: cLng, lat: cLat, radius });
          onSelect(cLng, cLat, radius);
        }
      });
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    return () => {
      centerMarkerRef.current?.remove();
      map.remove();
    };
  }, []);

  return (
    <div className="w-full border rounded-md overflow-hidden relative">
      <Button
        size="icon-sm"
        variant="secondary"
        className="absolute top-2 left-2 z-10"
        onClick={resetSelection}
      >
        <RotateCw className="w-4 h-4" />
      </Button>

      <div ref={mapContainer} className="aspect-video" />

      <div className="flex justify-between p-1">
        <span className="text-xs text-muted-foreground">
          Lng: {circle.lng} <br />
          Lat: {circle.lat} <br />
          Radius: {Math.round(circle.radius)} m
        </span>

        {/* <Button
          size="sm"
          variant="secondary"
          disabled={!circle.radius}
          onClick={() =>
            onSelect(circle.lng, circle.lat, circle.radius)
          }
        >
          Done
        </Button> */}
      </div>
    </div>
  );
};

export default MapCircleSelector;
