// store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  isAuthenticated: boolean;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  isLoading: true,   // loading initially
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      state.isLoading = false;
    },
    setAuthenticated: (state) => {
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  setAccessToken,
  setAuthenticated,
  setLoading,
  setError,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
