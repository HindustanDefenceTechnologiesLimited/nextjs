"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { useMap } from "../map-context";
import { useAppSelector } from "@/store/hook";
import { RootState } from "@/store/store";

const OSRM_BASE_URL = "http://localhost:5003";

const SOURCE_ID = "osrm-routes-source";
const PRIMARY_LAYER_ID = "osrm-route-primary";
const ALT_LAYER_ID = "osrm-route-alt";



export default function DirectionsLayer() {
    const map = useMap();
    const [primaryIndex, setPrimaryIndex] = useState(0);
    const directionsData = useAppSelector((state: RootState) => state.map.directionsData);
    const startMarkerRef = useRef<maplibregl.Marker | null>(null);
    const endMarkerRef = useRef<maplibregl.Marker | null>(null);
    const clickHandlerRef = useRef<((e: maplibregl.MapMouseEvent) => void) | null>(
        null
    );
    const START = directionsData?.start as [number, number];
    const END = directionsData?.end as [number, number];
    /* ------------------------------------------------
       INIT (runs only when START / END changes)
    ------------------------------------------------- */
    useEffect(() => {
        if (!map || !START || !END) {
            cleanup();
            return;
        }

        const run = () => init();

        if (!map.isStyleLoaded()) {
            map.once("load", run);
        } else {
            run();
        }

        return () => {
            cleanup();
            map.off("load", run);
        };
    }, [map, START, END]);

    /* ------------------------------------------------
       UPDATE ROUTE SELECTION (NO re-creation)
    ------------------------------------------------- */
    useEffect(() => {
        if (!map) return;

        if (map.getLayer(PRIMARY_LAYER_ID)) {
            map.setFilter(PRIMARY_LAYER_ID, [
                "==",
                ["get", "index"],
                primaryIndex,
            ]);
        }

        if (map.getLayer(ALT_LAYER_ID)) {
            map.setFilter(ALT_LAYER_ID, [
                "!=",
                ["get", "index"],
                primaryIndex,
            ]);
        }
    }, [map, primaryIndex]);

    /* ------------------------------------------------
       INITIAL SETUP
    ------------------------------------------------- */
    async function init() {
        if (!map) return;

        // Prevent duplicate init
        if (map.getSource(SOURCE_ID)) {
            cleanup();
        }

        /* ---------- Fetch routes ---------- */
        const url = `${OSRM_BASE_URL}/route/v1/driving/${START.join(
            ","
        )};${END.join(",")}?overview=full&geometries=geojson&alternatives=true`;

        const res = await fetch(url);
        const data = await res.json();

        if (!data.routes?.length) return;

        const featureCollection: GeoJSON.FeatureCollection<GeoJSON.LineString> = {
            type: "FeatureCollection",
            features: data.routes.map((route: any, index: number) => ({
                type: "Feature",
                geometry: route.geometry,
                properties: { index },
                id: index,
            })),
        };

        /* ---------- Source ---------- */
        map.addSource(SOURCE_ID, {
            type: "geojson",
            data: featureCollection,
        });

        /* ---------- Alternative routes ---------- */
        map.addLayer({
            id: ALT_LAYER_ID,
            type: "line",
            source: SOURCE_ID,
            paint: {
                "line-color": "#94a3b8",
                "line-width": 4,
                "line-opacity": 0.6,
            },
            filter: ["!=", ["get", "index"], primaryIndex],
        });

        /* ---------- Primary route ---------- */
        map.addLayer({
            id: PRIMARY_LAYER_ID,
            type: "line",
            source: SOURCE_ID,
            paint: {
                "line-color": "#2563eb",
                "line-width": 6,
                "line-opacity": 0.95,
            },
            filter: ["==", ["get", "index"], primaryIndex],
        });

        /* ---------- Click handler ---------- */
        const handleClick = (e: maplibregl.MapMouseEvent) => {
            const features = map.queryRenderedFeatures(e.point, {
                layers: [ALT_LAYER_ID, PRIMARY_LAYER_ID],
            });

            if (!features.length) return;

            const index = features[0].properties?.index;
            if (typeof index === "number") {
                setPrimaryIndex(index);
            }
        };

        clickHandlerRef.current = handleClick;
        map.on("click", handleClick);

        /* ---------- Start marker ---------- */
        startMarkerRef.current = new maplibregl.Marker({
            color: "#22c55e",
            scale: 1.1,
        })
            .setLngLat(START)
            .addTo(map);

        /* ---------- End marker ---------- */
        endMarkerRef.current = new maplibregl.Marker({
            color: "#ef4444",
            scale: 1.1,
        })
            .setLngLat(END)
            .addTo(map);
    }

    /* ------------------------------------------------
       CLEANUP (runs ONLY on unmount)
    ------------------------------------------------- */
    function cleanup() {
        if (!map) return;

        try {
            if (clickHandlerRef.current) {
                map.off("click", clickHandlerRef.current);
                clickHandlerRef.current = null;
            }

            [PRIMARY_LAYER_ID, ALT_LAYER_ID].forEach(id => {
                if (map.getLayer(id)) map.removeLayer(id);
            });

            if (map.getSource(SOURCE_ID)) {
                map.removeSource(SOURCE_ID);
            }

            startMarkerRef.current?.remove();
            endMarkerRef.current?.remove();
        } catch {
            // map already destroyed — ignore safely
        }

        startMarkerRef.current = null;
        endMarkerRef.current = null;
    }

    return null;
}
