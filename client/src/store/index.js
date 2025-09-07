import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import slices
import authReducer from './authSlice';
import vegetablesReducer from './vegetablesSlice';
import cartReducer from './cartSlice';

// Persist config for auth
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token', 'user', 'isAuthenticated'],
};

// Persist config for cart
const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items', 'total'],
};

// Create persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

// Combine reducers
const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  vegetables: vegetablesReducer,
  cart: persistedCartReducer,
});

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

// Export types for TypeScript (optional)
export const AppDispatch = store.dispatch;
export default store;
