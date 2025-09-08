// src/store/authSlice.ts
import { createSlice, } from '@reduxjs/toolkit';
import type{  PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name?: string;
  email: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const tokenFromStorage = localStorage.getItem('authToken');

const initialState: AuthState = {
  user: null,
  token: tokenFromStorage,
  isAuthenticated: !!tokenFromStorage,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem('authToken', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authToken');
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
