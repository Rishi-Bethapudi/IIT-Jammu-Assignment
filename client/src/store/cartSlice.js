import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price, image, quantity = 1 } = action.payload;
      const existing = state.items.find((item) => item.id === id);
      if (existing) existing.quantity += quantity;
      else state.items.push({ id, name, price, image, quantity });
      state.error = null;
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.error = null;
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existing = state.items.find((item) => item.id === id);
      if (existing) existing.quantity = quantity <= 0 ? 0 : quantity;
      state.items = state.items.filter((item) => item.quantity > 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setLoading,
  setError,
} = cartSlice.actions;
export default cartSlice.reducer;
