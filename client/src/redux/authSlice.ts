import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logout as apiLogout } from '../http/authApi';

// Асинхронное действие для выхода
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { dispatch }) => {
  await apiLogout();
  dispatch(logout());
});

const initialState = {
  isAuth: !!localStorage.getItem('user'),
  user: JSON.parse(localStorage.getItem('user')) || {},
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuth: (state, action) => {
      state.isAuth = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isAuth = false;
      state.user = {};
      localStorage.removeItem('user');
    },
  },
});

export const { setIsAuth, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
