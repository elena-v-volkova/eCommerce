import type { ReactNode } from 'react';

import { MemoryRouter } from 'react-router-dom';

import { AuthProvider } from '@/shared/model/AuthContext';

export const RouterWrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>
    <AuthProvider>{children}</AuthProvider>
  </MemoryRouter>
);
