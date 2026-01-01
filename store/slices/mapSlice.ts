// store/slices/missionSlice.ts
import { Asset, AssetPosition, Geofence, Mission, MissionStatus, Track, TrackPosition } from '@/lib/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { set } from 'date-fns';


type MapDataType = Track | TrackPosition | Asset | AssetPosition | Geofence | null;
type MapType = 'track' | 'trackPosition' | 'asset' | 'assetPosition' | 'geofence' | null;
type PositionEntity = TrackPosition | AssetPosition;


type MapState = {
    ref: maplibregl.Map | null,
    data: MapDataType;
    type: MapType;
    routeFocusData: PositionEntity[];
    routeFocusEntity: Track | Asset | null;
    directionsData: { start: [number, number], end: [number, number] } | null;
    mapElementsVisibility: {
        tracks: boolean;
        assets: boolean;
        geofences: boolean;
        focuses: boolean;
        annotations: boolean;
        objectives: boolean;
        directions: boolean;
        toolbar: boolean;
    };
    loading: boolean;
    error?: string | null;
};

const initialState: MapState = {
    ref: null,
    data: null,
    type: null,
    routeFocusData: [],
    routeFocusEntity: null,
    directionsData: null,
    mapElementsVisibility: {
        tracks: true,
        assets: true,
        geofences: true,
        focuses: true,
        annotations: true,
        objectives: true,
        directions: true,
        toolbar: true
    },
    loading: false,
    error: null,
};

const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        setRouteFocusData(state, action: PayloadAction<PositionEntity[]>) {
            state.routeFocusData = action.payload;
        },
        setRouteFocusEntity(state, action: PayloadAction<Track | Asset | null>) {
            state.routeFocusEntity = action.payload;
        },
        setMapData(state, action: PayloadAction<MapDataType>) {
            state.data = action.payload;
        },
        setMapType(state, action: PayloadAction<MapType>) {
            state.type = action.payload;
        },
        setMapElementVisibility (state, action: PayloadAction<{ key: keyof MapState['mapElementsVisibility'], value: boolean }>) {
            state.mapElementsVisibility[action.payload.key] = action.payload.value;
        },
        setAllMapElementVisibility (state, action: PayloadAction<{ value: boolean }>) {
            Object.keys(state.mapElementsVisibility).forEach(key => state.mapElementsVisibility[key as keyof MapState['mapElementsVisibility']] = action.payload.value);
        },
        setDirectionsData(state, action: PayloadAction<{ start: [number, number], end: [number, number] } | null>) {
            state.directionsData = action.payload;  
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
    },
});

export const {
  setMapData,
  setMapType,
  setLoading,
  setError,
  setRouteFocusData,
  setRouteFocusEntity,
  setMapElementVisibility,
  setAllMapElementVisibility,
  setDirectionsData
} = mapSlice.actions;
export default mapSlice.reducer;