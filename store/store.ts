// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import missionsReducer from './slices/missionsSlice';
import missionReducer from './slices/missionSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    missions: missionsReducer,
    auth: authReducer,
    mission: missionReducer
  },
});

// Types for use in typed hooks/components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;