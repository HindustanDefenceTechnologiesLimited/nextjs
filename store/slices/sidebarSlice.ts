// store/slices/sidebarSlice.ts
import { Asset,  Objective, Sensor, Track } from '@/lib/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type sidebarDataType = Asset | Sensor | Objective | Track | null;
type sidebarTypeType = 'asset' | 'sensor' | 'objective' | 'track' | null; 
type sidebarState = {
  type: sidebarTypeType;
  data: sidebarDataType;
  loading: boolean;
  error?: string | null;
};

const initialState: sidebarState = {
  type: null,
  data: null,
  loading: false,
  error: null,
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {

    setSidebarData(state, action: PayloadAction<sidebarDataType>) {
      state.data = action.payload;
    },
    setSidebarType(state, action: PayloadAction<sidebarTypeType>) {
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

export const { setSidebarData, setSidebarType, setLoading, setError } = sidebarSlice.actions;
export default sidebarSlice.reducer;