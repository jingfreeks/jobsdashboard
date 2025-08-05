import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectUserRoles } from '@/features/auth';
import type { RootState } from '@/config/store';

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}

const RoleBasedRoute = ({ children, allowedRoles, fallbackPath = '/login' }: RoleBasedRouteProps) => {
  const userRoles = useSelector((state: RootState) => selectUserRoles(state));
  
  // Handle edge cases
  if (!Array.isArray(userRoles) || !Array.isArray(allowedRoles)) {
    return <Navigate to={fallbackPath} replace />;
  }
  
  // Check if user has any of the allowed roles (case-insensitive comparison)
  const hasRequiredRole = userRoles.some(role => 
    allowedRoles.some(allowedRole => 
      role.toLowerCase() === allowedRole.toLowerCase()
    )
  );
  
  if (!hasRequiredRole) {
    return <Navigate to={fallbackPath} replace />;
  }
  
  return <>{children}</>;
};

export default RoleBasedRoute; 