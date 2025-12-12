// store/slices/missionSlice.ts
import { Geofence, Mission, MissionStatus, Track } from '@/lib/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type MissionState = {
  data: Mission;
  loading: boolean;
  error?: string | null;
};

const initialState: MissionState = {
  data: {
    id: '',
    name: '',
    type: '',
    startTime: '',
    status: MissionStatus.NEW,
    createdById: '',
    createdAt: '',
    updatedAt: '',
  },
  loading: false,
  error: null,
};

const missionsSlice = createSlice({
  name: 'mission',
  initialState,
  reducers: {

    setMission(state, action: PayloadAction<Mission>) {
      state.data = action.payload;
    },
    updateMission(state, action: PayloadAction<Partial<Mission>>) {
      state.data = {
        ...state.data,
        ...action.payload,
      };
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    addTrack(state, action: PayloadAction<Track>) {
      state.data.tracks?.unshift(action.payload);
    },
    updateTrack(state, action: PayloadAction<Partial<Track> & { id: string }>) {
      const trackId = action.payload.id;
      console.log(trackId);
      state.data.tracks = state.data.tracks?.map((track) => {
        if (track.id === trackId) {
          return {
            ...track,
            ...action.payload,  
          };
        }
        return track;
      });
    },
    addGeofence(state, action: PayloadAction<Geofence>) {
      state.data.geofences?.push(action.payload);
    },
    deleteGeofence(state, action: PayloadAction<string>) {
      state.data.geofences = state.data.geofences?.filter((geofence) => geofence.id !== action.payload);
    },
  },
});

export const { setMission, setLoading, setError, updateTrack, addGeofence, deleteGeofence, updateMission, addTrack } = missionsSlice.actions;
export default missionsSlice.reducer;