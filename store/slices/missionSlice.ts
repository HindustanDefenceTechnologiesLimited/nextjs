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
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    updateTrack(state, action: PayloadAction<Partial<Track> & { id: string }>) {
      const trackId = action.payload.id;

      state.data.tracks = state.data.tracks?.map((track) => {
        if (track.id === trackId) {
          return {
            ...track,
            ...action.payload,   // 🔥 merge instead of replace
          };
        }
        return track;
      });
    },
    addGeofence(state, action: PayloadAction<Geofence>) {
      state.data.geofences?.push(action.payload);
    },
  },
});

export const { setMission, setLoading, setError, updateTrack, addGeofence } = missionsSlice.actions;
export default missionsSlice.reducer;