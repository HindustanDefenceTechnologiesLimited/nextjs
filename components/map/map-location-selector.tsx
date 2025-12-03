import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Props = {
  onSelect: (lng: number, lat: number) => void;
  center?: [number, number]; // default center
};

const MapLocationSelector = ({ onSelect, center = [73.8567, 18.5204] }: Props) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          "offline-tiles": {
            type: "raster",
            tiles: ["http://localhost:8080/styles/basic-preview/512/{z}/{x}/{y}.png"],
            tileSize: 512,
          },
        },
        layers: [
          {
            id: "base",
            type: "raster",
            source: "offline-tiles",
          },
        ],
      },
      center: center,
      zoom: 15,
    });

    mapRef.current = map;

    map.on("load", () => {
      map.on("click", (e) => {
        const { lng, lat } = e.lngLat;

        onSelect(lng, lat);

        // Remove previous marker
        if (markerRef.current) markerRef.current.remove();

        // Add new marker
        const marker = new maplibregl.Marker({ color: "red" })
          .setLngLat([lng, lat])
          .addTo(map);

        markerRef.current = marker;
      });
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.addControl(
      new maplibregl.ScaleControl({ maxWidth: 120, unit: "metric" }),
      "bottom-left"
    );

    return () => {
      if (markerRef.current) markerRef.current.remove();
      if (mapRef.current) mapRef.current.remove();
      mapRef.current = null;
    };
  }, []);

  // If center prop changes later, recenter map
  useEffect(() => {
    if (mapRef.current && center) {
      mapRef.current.setCenter(center);
    }
  }, [center]);

  return (
    <div className="w-full aspect-video">
      <div
        ref={mapContainer}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default MapLocationSelector;
