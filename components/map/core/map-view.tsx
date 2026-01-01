"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapContext } from "./map-context";
import FocusMarkerLayer from "./layers/focus-marker-layer";
import TrackMarkerLayer from "./layers/track-marker-layer";
import MapToolbar from "./layers/toolbar/map-toolbar";
import { Annotation, Asset, Geofence, Objective, Track } from "@/lib/types";
import RouteLayer from "./layers/route-layer";
import { RootState } from "@/store/store";
import GeofenceShapeLayer from "./layers/geofence-shape-layer";
import { dark_style } from "./style";
import AssetMarkerLayer from "./layers/asset-marker-layer";
import AnnotationMarkerLayer from "./layers/annotation-marker.layer";
import ObjectiveMarkerLayer from "./layers/objective-marker.layer";
import OptionsLayer from "./layers/options/options-layer";
import { useAppSelector } from "@/store/hook";
import DirectionsLayer from "./layers/directions-layer";
import LayerVisibilityLayer from "./layers/layer-visibility-menu";

type Props = {
    entites: {
        tracks: Track[];
        geofences: Geofence[];
        assets: Asset[];
        annotations: Annotation[];
        objectives: Objective[]
    };
};

export default function SimpleMap({ entites }: Props) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const mission = useAppSelector((state: RootState) => state.mission.data);
    const [ready, setReady] = useState(false);
    const mapElementsVisibility = useAppSelector((state: RootState) => state.map.mapElementsVisibility);

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            // @ts-ignore
            style: dark_style,
            center: [mission.mapCoordinates?.center.lng || 73.8567, mission.mapCoordinates?.center.lat || 18.5204],
            zoom: mission.mapCoordinates?.zoom || 13,
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
        mapRef.current?.easeTo({ center: [mission.mapCoordinates?.center.lng, mission.mapCoordinates?.center.lat], zoom: mission.mapCoordinates?.zoom })
    }, [mission.mapCoordinates])
    return (
        <div className="relative w-full h-full rounded-md overflow-hidden">

            <div ref={mapContainerRef} className="w-full h-full" />

            {/* ✅ layers render only after map is ready */}
            {ready && (
                <MapContext.Provider value={mapRef.current!}>
                    <OptionsLayer />
                    <LayerVisibilityLayer/>
                    {
                        mapElementsVisibility.directions && <DirectionsLayer/>
                    }
                    {
                        mapElementsVisibility.focuses && (
                            <>
                                <FocusMarkerLayer />
                                <RouteLayer />
                            </>
                        )
                    }
                    {
                        mapElementsVisibility.annotations && <AnnotationMarkerLayer annotations={entites.annotations} />
                    }
                    {
                        mapElementsVisibility.tracks && <TrackMarkerLayer tracks={entites.tracks} />
                    }
                    {
                        mapElementsVisibility.geofences && <GeofenceShapeLayer geofences={entites.geofences} />
                    }
                    {
                        mapElementsVisibility.assets && <AssetMarkerLayer assets={entites.assets} />
                    }
                    {
                        mapElementsVisibility.objectives && <ObjectiveMarkerLayer objectives={entites.objectives} />
                    }
                    {
                        mapElementsVisibility.toolbar && <MapToolbar />
                    }
                </MapContext.Provider>
            )}
        </div>
    );
}