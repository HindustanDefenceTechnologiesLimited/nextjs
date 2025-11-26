// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import missionsReducer from './slices/missionsSlice';
import missionReducer from './slices/missionSlice';
import authReducer from './slices/authSlice';
import sidebarReducer from './slices/sidebarSlice'
import mapReducer from './slices/mapSlice'

export const store = configureStore({
  reducer: {
    missions: missionsReducer,
    auth: authReducer,
    mission: missionReducer,
    sidebar: sidebarReducer,
    map: mapReducer
  },
});

// Types for use in typed hooks/components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;