// src/redux/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '@/src/services/authService';
import { User } from '@/src/types';

interface AuthState {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

// --- Thunks ---
export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
  const token = await authService.getToken();
  // In a real app, you would use the token to fetch user profile, 
  // but for this assignment, we use a mock profile.
  if (token) {
    // Simulate user data retrieval using a mock name/username
    return { token, firstName: 'NBA Fan', username: 'SportifyUser' } as User;
  }
  return rejectWithValue('No stored token');
});

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }: any, { rejectWithValue }) => {
    try {
      const { token, firstName } = await authService.login(username, password);
      return { token, firstName, username } as User;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await authService.removeToken();
});

// --- Slice ---
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Used by the custom hook to manage loading state when checking token
    setAuthStatus: (state, action: PayloadAction<AuthState['status']>) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load User (Initial App Load)
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
      })
      .addCase(loadUser.rejected, (state) => {
        state.user = null;
        state.status = 'idle';
      })
      
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.user = null;
      })

      // Logout User
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = 'idle';
        state.error = null;
      });
  },
});

export const { setAuthStatus } = authSlice.actions;
export default authSlice.reducer;