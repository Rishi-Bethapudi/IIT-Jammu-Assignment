import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '@/store';

import type { ReactNode } from 'react';

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
