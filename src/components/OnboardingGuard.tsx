import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectIsAuthenticated, selectOnboardingComplete } from '@/features/auth';
import type { RootState } from '@/config/store';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

const OnboardingGuard = ({ children }: OnboardingGuardProps) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));
  const onboardingComplete = useSelector((state: RootState) => selectOnboardingComplete(state));

  useEffect(() => {
    // Check if onboarding is complete from localStorage as fallback
    const localStorageOnboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
    
    if (isAuthenticated && !onboardingComplete && !localStorageOnboardingComplete) {
      navigate('/onboarding');
    }
  }, [isAuthenticated, onboardingComplete, navigate]);

  // If not authenticated, don't show anything (let other guards handle it)
  if (!isAuthenticated) {
    return null;
  }

  // If onboarding is not complete, don't render children
  if (!onboardingComplete && localStorage.getItem('onboardingComplete') !== 'true') {
    return null;
  }

  return <>{children}</>;
};

export default OnboardingGuard; 