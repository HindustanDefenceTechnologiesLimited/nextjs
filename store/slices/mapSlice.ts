// store/slices/missionSlice.ts
import { Asset, Mission, MissionStatus, Track, TrackPosition } from '@/lib/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { set } from 'date-fns';


type MapDataType = Track | TrackPosition | Asset | null;
type MapType = 'track' | 'trackPosition' | 'asset' | null;

type MapState = {
    data: MapDataType;
    type: MapType;
    loading: boolean;
    error?: string | null;
};

const initialState: MapState = {
    data: null,
    type: null,
    loading: false,
    error: null,
};

const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {

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

export const { setMapData, setMapType, setLoading, setError } = mapSlice.actions;
export default mapSlice.reducer;