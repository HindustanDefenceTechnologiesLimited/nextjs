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
    loading: boolean;
    error?: string | null;
};

const initialState: MapState = {
    ref: null,
    data: null,
    type: null,
    routeFocusData: [],
    routeFocusEntity: null,
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
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        }
    },
});

export const { setMapData, setMapType, setLoading, setError, setRouteFocusData, setRouteFocusEntity } = mapSlice.actions;
export default mapSlice.reducer;