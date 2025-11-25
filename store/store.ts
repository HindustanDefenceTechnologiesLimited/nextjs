// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import missionReducer from './slices/missionsSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    mission: missionReducer,
    auth: authReducer,
  },
});

// Types for use in typed hooks/components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;