import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

export const AuthMonitor = () => {
  const { forceLogout } = useAuth();
  const { showError } = useToast();

  useEffect(() => {
    const checkForcedLogout = () => {
      const shouldForceLogout = localStorage.getItem('forceLogout');
      const logoutReason = localStorage.getItem('logoutReason');
      
      if (shouldForceLogout === 'true') {
        // Clear the flags
        localStorage.removeItem('forceLogout');
        localStorage.removeItem('logoutReason');
        
        // Show appropriate message
        if (logoutReason === 'Token expired') {
          showError('Your session has expired. Please log in again.');
        } else {
          showError('You have been logged out. Please log in again.');
        }
        
        // Trigger the logout process with API call
        forceLogout(logoutReason || 'Session expired');
      }
    };

    // Check immediately
    checkForcedLogout();

    // Also check on storage events (in case of multiple tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'forceLogout' && e.newValue === 'true') {
        checkForcedLogout();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [forceLogout, showError]);

  // This component doesn't render anything
  return null;
}; 