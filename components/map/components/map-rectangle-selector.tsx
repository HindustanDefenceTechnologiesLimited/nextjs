import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { RotateCw } from "lucide-react";

type Props = {
    onSelect: (lng1: number, lat1: number, lng2: number, lat2: number) => void;
    center?: [number, number];
};

const MapRectangleSelector = ({ onSelect, center = [73.8567, 18.5204] }: Props) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const marker1Ref = useRef<maplibregl.Marker | null>(null);
    const marker2Ref = useRef<maplibregl.Marker | null>(null);
    const [bounds, setBounds] = useState({
        lng1: 0,
        lat1: 0,
        lng2: 0,
        lat2: 0,
    });
    const resetSelection = () => {
        marker1Ref.current?.remove();
        marker2Ref.current?.remove();

        marker1Ref.current = null;
        marker2Ref.current = null;

        const map = mapRef.current;
        if (!map) return;

        const source = map.getSource("rectangle") as maplibregl.GeoJSONSource | undefined;
        if (source) {
            source.setData({
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: [],
                },
                properties: {},
            });
        }

        setBounds({
            lng1: 0,
            lat1: 0,
            lng2: 0,
            lat2: 0,
        });
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
            map.addSource("rectangle", {
                type: "geojson",
                data: {
                    type: "Feature",
                    geometry: {
                        type: "Polygon",
                        coordinates: [],
                    },
                    properties: {},
                },
            });

            map.addLayer({
                id: "rectangle-fill",
                type: "fill",
                source: "rectangle",
                paint: {
                    "fill-color": "#1d4ed8",
                    "fill-opacity": 0.2,
                },
            });

            map.addLayer({
                id: "rectangle-outline",
                type: "line",
                source: "rectangle",
                paint: {
                    "line-color": "#60a5fa",
                    "line-width": 2,
                },
            });

            map.on("click", (e) => {
                const { lng, lat } = e.lngLat;

                /* ✅ THIRD CLICK → RESET */
                if (marker1Ref.current && marker2Ref.current) {
                    resetSelection();
                }

                /* ✅ FIRST CLICK */
                if (!marker1Ref.current) {

                    marker1Ref.current = new maplibregl.Marker({ color: "red" })
                        .setLngLat([lng, lat])
                        .addTo(map);
                    setBounds((prev) => ({ ...prev, lng1: lng, lat1: lat }));

                    return;
                }

                /* ✅ SECOND CLICK */
                if (!marker2Ref.current) {
                    const [lng1, lat1] = marker1Ref.current.getLngLat().toArray();

                    // ❌ INVALID SELECTION
                    if (lng <= lng1 || lat >= lat1) {
                        toast.error("Invalid selection, please select a point on the right and below of the first point.");
                        return;
                    }


                    marker2Ref.current = new maplibregl.Marker({ color: "blue" })
                        .setLngLat([lng, lat])
                        .addTo(map);

                    const rectangle = {
                        type: "Feature",
                        geometry: {
                            type: "Polygon",
                            coordinates: [[
                                [lng1, lat1],
                                [lng, lat1],
                                [lng, lat],
                                [lng1, lat],
                                [lng1, lat1],
                            ]],
                        },
                        properties: {},
                    };

                    const source = map.getSource("rectangle") as maplibregl.GeoJSONSource;
                    // @ts-ignore
                    source.setData(rectangle);
                    setBounds((prev) => ({ ...prev, lng2: lng, lat2: lat }));

                    onSelect(lng1, lat1, lng, lat);
                }
            });

        });
const attri = document.getElementsByClassName('maplibregl-ctrl-attrib')
        attri[0].remove()
        map.addControl(new maplibregl.NavigationControl(), "top-right");
        map.addControl(new maplibregl.ScaleControl(), "bottom-left");

        return () => {
            marker1Ref.current?.remove();
            marker2Ref.current?.remove();
            map.remove();
        };
    }, []);

    return (
        <div className="w-full  border rounded-md overflow-hidden relative">
            <Button
                size="icon-sm"
                variant="secondary"
                className="absolute top-2 left-2 z-10"
                onClick={resetSelection}
            >
                <RotateCw className="w-4 h-4" />
            </Button>

            <div
                ref={mapContainer}
                className="aspect-video"
                style={{ width: "100%", height: "100%" }}
            />
            <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">
                    Lng1: {bounds.lng1}, Lat1: {bounds.lat1} <br />
                    Lng2: {bounds.lng2}, Lat2: {bounds.lat2}
                </span>
                {/* <Button size='sm' variant='secondary' className="my-1 mr-1"
                    disabled={!bounds.lng1 || !bounds.lat1 || !bounds.lng2 || !bounds.lat2}
                    onClick={() => onSelect(bounds.lng1, bounds.lat1, bounds.lng2, bounds.lat2)}
                >
                    Done
                </Button> */}
            </div>
        </div>
    );
};

export default MapRectangleSelector;
