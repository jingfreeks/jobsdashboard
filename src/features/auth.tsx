import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../config/store';

interface AuthState {
  user: string | null;
  token: string | null;
  userId: string | null;
  roles: string[];
}

interface CredentialsPayload {
  user: string;
  accessToken: string;
  userId: string;
  roles: string[];
}

const initialState: AuthState = {
  user: null,
  token: null,
  userId: null,
  roles: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<CredentialsPayload>) => {
      const { user, accessToken, userId, roles } = action.payload;
      
      // Validate the payload
      if (!user || !accessToken || !userId) {
        console.warn('Invalid credentials payload:', action.payload);
        return;
      }
      
      state.user = user;
      state.token = accessToken;
      state.userId = userId;
      state.roles = Array.isArray(roles) ? roles : [];
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.userId = null;
      state.roles = [];
    },
    // Action to handle rehydration from storage
    rehydrateAuth: (state, action: PayloadAction<Partial<AuthState>>) => {
      const { user, token, userId, roles } = action.payload;
      if (user) state.user = user;
      if (token) state.token = token;
      if (userId) state.userId = userId;
      if (roles) state.roles = Array.isArray(roles) ? roles : [];
    },
  },
});

export const { setCredentials, setLogout, rehydrateAuth } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentUserId = (state: RootState) => state.auth.userId;
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectUserRoles = (state: RootState) => state.auth.roles;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;