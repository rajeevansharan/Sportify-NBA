// Feature: Favourites
// src/redux/slices/favoritesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// --- Import RootState from the store ---
import { RootState } from '../store';

interface FavoritesState {
  // Store an array of match IDs
  favoriteMatchIds: string[]; 
}

const initialState: FavoritesState = {
  favoriteMatchIds: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.favoriteMatchIds.includes(id)) {
        state.favoriteMatchIds = state.favoriteMatchIds.filter(matchId => matchId !== id);
      } else {
        state.favoriteMatchIds.push(id);
      }
    },
    clearFavorites: (state) => {
      state.favoriteMatchIds = [];
    }
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;

// --- Selectors with explicit RootState typing ---
// Selector function to check if a match is a favorite
export const selectIsFavorite = (state: RootState, id: string) => 
  state.favorites.favoriteMatchIds.includes(id);

// Selector function to get all favorite IDs
export const selectFavoriteIds = (state: RootState) => 
  state.favorites.favoriteMatchIds;