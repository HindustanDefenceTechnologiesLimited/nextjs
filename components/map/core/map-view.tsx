"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapContext } from "./map-context";
import FocusMarkerLayer from "./layers/focus-marker-layer";
import TrackMarkerLayer from "./layers/track-marker-layer";
import MapToolbar from "./map-toolbar";
import { Geofence, Track } from "@/lib/types";
import RouteLayer from "./layers/route-layer";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import GeofenceShapeLayer from "./layers/geofence-shape-layer";
import { dark_style } from "./style";

type Props = {
    entites: {
        tracks: Track[];
        geofences: Geofence[];
    };
};

export default function SimpleMap({ entites }: Props) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const mission = useSelector((state: RootState) => state.mission.data);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            // @ts-ignore
            style: dark_style,
            center: [73.8567, 18.5204],
            zoom: 15,
        });

        map.addControl(new maplibregl.NavigationControl(), "top-right");
        map.addControl(
            new maplibregl.ScaleControl({ maxWidth: 120, unit: "metric" }),
            "bottom-left"
        );

        mapRef.current = map;
        setReady(true);
        const attri = document.getElementsByClassName('maplibregl-ctrl-attrib')
        attri[0].remove()
        return () => {
            map.remove();
            mapRef.current = null;
        };

    }, []);
    useEffect(() => {
        if (!mission.mapCoordinates) return
        mapRef.current?.easeTo({ center: [mission.mapCoordinates?.center.lng, mission.mapCoordinates?.center.lat], zoom: 15 })
    }, [mission.mapCoordinates])
    return (
        <div className="relative w-full h-full rounded-md overflow-hidden">

            {/* ✅ container NEVER changes */}
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* ✅ layers render only after map is ready */}
            {ready && (
                <MapContext.Provider value={mapRef.current!}>
                    <RouteLayer />
                    <MapToolbar />
                    <FocusMarkerLayer />
                    <TrackMarkerLayer tracks={entites.tracks} />
                    <GeofenceShapeLayer geofences={entites.geofences}/>
                </MapContext.Provider>
            )}
        </div>
    );
}

