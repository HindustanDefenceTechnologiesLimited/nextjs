// store/slices/missionsSlice.ts
import { Mission } from '@/lib/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type MissionsState = {
  items: Mission[];
  loading: boolean;
  error?: string | null;
};

const initialState: MissionsState = {
  items: [],
  loading: false,
  error: null,
};

const missionsSlice = createSlice({
  name: 'missions',
  initialState,
  reducers: {
    addMission(state, action: PayloadAction<Mission>) {
      state.items.push(action.payload);
    },
    removeMission(state, action: PayloadAction<string>) {
      state.items = state.items.filter(m => m.id !== action.payload);
    },
    setMissions(state, action: PayloadAction<Mission[]>) {
      state.items = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    }
  },
});

export const { addMission, removeMission, setMissions, setLoading, setError } = missionsSlice.actions;
export default missionsSlice.reducer;