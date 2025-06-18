import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';

import { useAuth } from './shared/model/AuthContext';

export const RedirectIfAuthenticated = ({
  children,
}: {
  children: ReactNode;
}) => {
  // const { token } = useSession();
  const { user } = useAuth();
  const location = useLocation();

  if (user && location.pathname === '/login') {
    return <Navigate replace to="/" />;
  }
  if (user && location.pathname === '/register') {
    return <Navigate replace to="/" />;
  }
  if (!user && location.pathname.match('/profile')) {
    return <Navigate replace to="/login" />;
  }

  return <div>{children}</div>;
};
