import { createSlice,  } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from './authTypes';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      if (action.payload) state.error = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setAuth, clearAuth, setLoading, setError, updateUser } =
  authSlice.actions;

export default authSlice.reducer;
