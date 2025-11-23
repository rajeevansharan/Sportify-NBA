// Feature: State Management
// src/redux/slices/matchesSlice.ts
import { sportsService } from '@/src/services/sportsService';
import { Match } from '@/src/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MatchesState {
  matches: Match[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MatchesState = {
  matches: [],
  status: 'idle',
  error: null,
};

// --- Thunks ---
export const fetchUpcomingMatches = createAsyncThunk(
  'matches/fetchUpcomingMatches',
  async (_, { rejectWithValue }) => {
    try {
      const matches = await sportsService.getUpcomingMatches();
      return matches;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// --- Slice ---
const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    // Optionally clear matches
    clearMatches: (state) => {
      state.matches = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUpcomingMatches.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUpcomingMatches.fulfilled, (state, action: PayloadAction<Match[]>) => {
        state.status = 'succeeded';
        state.matches = action.payload;
        state.error = null;
      })
      .addCase(fetchUpcomingMatches.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearMatches } = matchesSlice.actions;
export default matchesSlice.reducer;