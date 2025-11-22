// src/redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/authSlice';
import favoritesReducer from './slices/favoritesSlice';
import matchesReducer from './slices/matchesSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Persist Config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  // ONLY persist the favorites slice
  whitelist: ['favorites'], 
  blacklist: ['auth', 'matches'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  matches: matchesReducer,
  favorites: favoritesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Middleware setup necessary for redux-persist
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});

// --- Export types and defined typed hooks ---

// Define RootState type based on the store structure
export type RootState = ReturnType<typeof store.getState>;

// Define AppDispatch type
export type AppDispatch = typeof store.dispatch;

// Custom hooks for typed Redux usage
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const persistor = persistStore(store);