import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';

import { useSession } from './shared/model/useSession';

export const RedirectIfAuthenticated = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { token } = useSession();
  const location = useLocation();

  if (token && location.pathname === '/login') {
    return <Navigate replace to="/" />;
  }
  if (token && location.pathname === '/register') {
    return <Navigate replace to="/" />;
  }
  if (!token && location.pathname === '/profile') {
    return <Navigate replace to="/login" />;
  }

  return <div>{children}</div>;
};
