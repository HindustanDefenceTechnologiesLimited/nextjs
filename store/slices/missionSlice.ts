// store/slices/missionSlice.ts
import { Mission, MissionStatus } from '@/lib/types';
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
    startTime: new Date(),
    endTime: new Date(),
    status: MissionStatus.NEW,
    createdById: '',
    createdAt: new Date(),
    updatedAt: new Date(),
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
    }
  },
});

export const { setMission, setLoading, setError } = missionsSlice.actions;
export default missionsSlice.reducer;