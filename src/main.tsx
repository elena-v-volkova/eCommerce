import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.tsx';
import { Provider } from './Provider.tsx';
import './index.css';
import DefaultLayout from './layouts/Default.tsx';

createRoot(document.body).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
        <DefaultLayout>
          <App />
        </DefaultLayout>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
