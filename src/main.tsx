import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.tsx';
import { Provider } from './Provider.tsx';
import './index.css';
import DefaultLayout from './layouts/Default.tsx';
import { AuthProvider } from './shared/model/AuthContext.tsx';
import { CartProvider } from './shared/context/CartContext.tsx';

createRoot(document.body).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Provider>
            <DefaultLayout>
              <App />
            </DefaultLayout>
          </Provider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
