import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App';
import { Provider } from './Provider';
import './index.css';
import DefaultLayout from './layouts/Default';
import { AuthProvider } from './shared/model/AuthContext';

createRoot(document.body).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Provider>
          <DefaultLayout>
            <App />
          </DefaultLayout>
        </Provider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
