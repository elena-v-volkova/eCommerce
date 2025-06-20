import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router';

import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../model/AuthContext';

import { Provider } from '@/Provider';

export const TestingWrapper = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <Provider>{children}</Provider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);
