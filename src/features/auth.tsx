import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../config/store';

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, userId: null, roles: [] },
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, userId, roles } = action.payload;
      state.user = user;
      state.token = accessToken;
      state.userId = userId;
      state.roles = roles;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.userId = null;
      state.roles = [];
    },
  },
});

export const { setCredentials, setLogout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentUserId = (state: RootState) => state.auth.userId;
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectUserRoles = (state: RootState) => state.auth.roles;