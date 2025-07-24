import { configureStore } from '@reduxjs/toolkit';
//import authReducer from './features/auth/authSlice';
import { loginApi } from '@/features/auth/loginApiSlice';

export const store = configureStore({
  reducer: {
    [loginApi.reducerPath]: loginApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loginApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 