import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchUsersByUsername } from '../http/searchApi';

export const searchUsers = createAsyncThunk('users/searchUsers', async (username: string) => {
  const response = await searchUsersByUsername(username);
  return response;
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    searchResults: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.slice(0, 3);
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSearchResults } = userSlice.actions;
export default userSlice.reducer;
