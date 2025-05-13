import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';

import { useSession } from './shared/model/useSession';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token } = useSession();
  const location = useLocation();

  if (token && location.pathname === '/login') {
    return <Navigate replace to="/" />;
  }

  return <div>{children}</div>;
};
