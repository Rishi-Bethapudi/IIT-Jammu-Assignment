import { createSlice,  } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Vegetable, VegetablesState } from '@/components/vegetables/types';

const initialState: VegetablesState = {
  items: [],
  loading: false,
  error: null,
};

const vegetablesSlice = createSlice({
  name: 'vegetables',
  initialState,
  reducers: {
    setVegetables: (state, action: PayloadAction<Vegetable[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateVegetable: (state, action: PayloadAction<Vegetable>) => {
      const index = state.items.findIndex(
        (item) => item._id === action.payload._id
      );
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    clearVegetables: (state) => {
      state.items = [];
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
  },
});

export const {
  setVegetables,
  updateVegetable,
  clearVegetables,
  setLoading,
  setError,
} = vegetablesSlice.actions;

export default vegetablesSlice.reducer;
