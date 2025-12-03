"use client";

import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import TrackPopup from "./popup/track-popup";
import { Track } from "@/lib/types";
import { style } from "./style";
import MapToolbar from "./map-toolbar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
type Props = {
    entites: {
        tracks: Track[];
    };
};

export default function SimpleMap({ entites }: Props) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const mission = useSelector((state: RootState) => state.mission.data);
    // console.log(mission.mapCoordinates)
    const markersRef = useRef<maplibregl.Marker[]>([]);
    const rootsRef = useRef<any[]>([]);

    useEffect(() => {
        if (!mapContainer.current) return;

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: "http://localhost:8080/styles/dark/style.json",

            center: [78.8718, 21.7679],
            // center: [73.8567, 18.5204 ],
            zoom: 15,
        });
        // console.log(map.getCenter())
        mapRef.current = map;
        map.addControl(new maplibregl.NavigationControl(), "top-right");
        map.addControl(
            new maplibregl.ScaleControl({ maxWidth: 120, unit: "metric" }),
            "bottom-left"
        );

        return () => {
            // FULL CLEANUP
            rootsRef.current.forEach((r) => r.unmount());
            rootsRef.current = [];

            markersRef.current.forEach((m) => m.remove());
            markersRef.current = [];

            map.remove();
            mapRef.current = null;
        };
    }, []);
    useEffect(() => {
        if (!mapRef.current) return;
        mapRef.current.setCenter([mission.mapCoordinates?.center.lng || 68, mission.mapCoordinates?.center.lat || 18]);
        mapRef.current.setZoom(mission.mapCoordinates?.zoom || 15);
    }, [mission.mapCoordinates]);
    // -------------------------------
    // RENDER MARKERS WHEN TRACKS CHANGE
    // -------------------------------
    useEffect(() => {
        if (!mapRef.current) return;

        // remove existing markers + popups
        rootsRef.current.forEach((r) => r.unmount());
        rootsRef.current = [];

        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        // add new markers
        entites.tracks.forEach((track, index) => {
            if (track.positions?.length === 0 || !track.positions) return;
            const markerContainer = document.createElement("div");
            const root = createRoot(markerContainer);
            rootsRef.current.push(root);
            root.render(<TrackPopup track={track} />);

            const marker = new maplibregl.Marker({
                element: markerContainer,
                anchor: "center",
                rotation: track.positions[0].heading,
                rotationAlignment: 'map',
            })
                .setLngLat([track.positions[0].longitude, track.positions[0].latitude],)
                .addTo(mapRef.current!);

            markersRef.current.push(marker);
        });
    }, [entites.tracks]);

    return (
        <div className="relative">
            <MapToolbar />
            <div
                ref={mapContainer}
                style={{
                    width: "100%",
                    height: "90vh",
                }}
            />
        </div>
    );
}
