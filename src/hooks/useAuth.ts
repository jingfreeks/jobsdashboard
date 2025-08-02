import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '@/features/loginApiSlice';
import { setLogout } from '@/features/auth';
import { purgePersistedState } from '@/utils/persistUtils';
import { useToast } from '@/hooks/useToast';
import type { AppDispatch } from '@/config/store';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();
  const { showError } = useToast();

  const logout = useCallback(async (showMessage = true) => {
    try {
      // Call the logout API endpoint
      await logoutApi({}).unwrap();
      if (showMessage) {
        console.log('Successfully logged out from server');
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
      if (showMessage) {
        showError('Failed to logout from server, but you have been logged out locally');
      }
    } finally {
      // Always clear local state and redirect, even if API call fails
      dispatch(setLogout());
      await purgePersistedState(); // Clear persisted state
      navigate("/login");
    }
  }, [dispatch, navigate, logoutApi, showError]);

  const forceLogout = useCallback(async (reason = 'Session expired') => {
    console.warn(`Force logout triggered: ${reason}`);
    await logout(false); // Don't show error message for automatic logout
  }, [logout]);

  return {
    logout,
    forceLogout,
  };
}; 