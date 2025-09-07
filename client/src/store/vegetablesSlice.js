import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
};

// Create the vegetables slice
const vegetablesSlice = createSlice({
  name: 'vegetables',
  initialState,
  reducers: {
    setVegetables: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearVegetables: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
    updateVegetable: (state, action) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    loadVegetablesSuccess: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    loadVegetablesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loadVegetablesFailure: (state, action) => {
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
export const selectVegetables = (state) => state.vegetables.items;
export const selectVegetablesLoading = (state) => state.vegetables.loading;
export const selectVegetablesError = (state) => state.vegetables.error;
export const selectVegetableById = (state, id) =>
  state.vegetables.items.find((item) => item.id === id);
export const selectLowStockVegetables = (state) =>
  state.vegetables.items.filter((item) => item.lowStock);
