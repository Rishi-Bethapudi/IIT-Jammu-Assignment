import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Vegetable, VegetablesState } from './vegetablesTypes';

// Initial state
const initialState: VegetablesState = {
  items: [],
  loading: false,
  error: null,
};

// Create the vegetables slice
const vegetablesSlice = createSlice({
  name: 'vegetables',
  initialState,
  reducers: {
    setVegetables: (state, action: PayloadAction<Vegetable[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearVegetables: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
    updateVegetable: (state, action: PayloadAction<Vegetable>) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    loadVegetablesSuccess: (state, action: PayloadAction<Vegetable[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    loadVegetablesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loadVegetablesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Export actions
export const {
  setVegetables,
  setLoading,
  setError,
  clearVegetables,
  updateVegetable,
  loadVegetablesSuccess,
  loadVegetablesStart,
  loadVegetablesFailure,
} = vegetablesSlice.actions;

// Export reducer
export default vegetablesSlice.reducer;

// Selector functions
export const selectVegetables = (state: { vegetables: VegetablesState }) => state.vegetables.items;
export const selectVegetablesLoading = (state: { vegetables: VegetablesState }) => state.vegetables.loading;
export const selectVegetablesError = (state: { vegetables: VegetablesState }) => state.vegetables.error;
export const selectVegetableById = (state: { vegetables: VegetablesState }, id: string) =>
  state.vegetables.items.find((item) => item.id === id);
export const selectLowStockVegetables = (state: { vegetables: VegetablesState }) =>
  state.vegetables.items.filter((item) => item.lowStock);
