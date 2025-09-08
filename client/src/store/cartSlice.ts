import { createSlice,  } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, CartState } from '@/components/cart/types';

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ _id: string; quantity: number }>
    ) => {
      const item = state.items.find((i) => i._id === action.payload._id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCartError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  setCartLoading,
  setCartError,
} = cartSlice.actions;

export default cartSlice.reducer;
