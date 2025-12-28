"use client";

import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import TrackPopup from "../components/map/popup/track-popup";
import { Track, TrackPosition } from "@/lib/types";
import MapToolbar from "../components/map/core/map-toolbar";
import { useAppSelector } from "@/store/hook";
import { RootState } from "@/store/store";
type Props = {
    entites: {
        tracks: Track[];
    };
};

export default function SimpleMap({ entites }: Props) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const mission = useAppSelector((state: RootState) => state.mission.data);
    const mapFocusType = useAppSelector((state: RootState) => state.map.type);
    const mapFocusData = useAppSelector((state: RootState) => state.map.data);
    const focusMarkerRef = useRef<maplibregl.Marker | null>(null);

    // console.log(mission.mapCoordinates)
    const markersRef = useRef<maplibregl.Marker[]>([]);
    const rootsRef = useRef<any[]>([]);

    useEffect(() => {
        if (!mapContainer.current) return;

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: "http://localhost:8080/styles/dark/style.json",
            center: [73.8567, 18.5204],
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

        if (mapFocusType === "trackPosition") {
            const trackPosition = mapFocusData as TrackPosition;

            if (focusMarkerRef.current) {
                focusMarkerRef.current.remove();
                focusMarkerRef.current = null;
            }

            const marker = new maplibregl.Marker()
                .setLngLat([trackPosition.longitude, trackPosition.latitude])
                .addTo(mapRef.current);
            focusMarkerRef.current = marker;

            mapRef.current.setCenter([
                trackPosition.longitude,
                trackPosition.latitude,
            ]);
            mapRef.current.setZoom(15);
        }
    }, [mapFocusType, mapFocusData]);
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
        <div className="relative w-full h-full rounded-md overflow-hidden">
            <MapToolbar />
            <div
                ref={mapContainer}
                className="w-full h-full"
            />
        </div>
    );
}
