import {
  TokenStore,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from '@commercetools/ts-client';
// import { tokenCache } from './login';

export const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY || '';
export const clientId = import.meta.env.VITE_CTP_CLIENT_ID || '';
export const clientSecret = import.meta.env.VITE_CTP_CLIENT_SECRET || '';
export const authUrl = import.meta.env.VITE_CTP_AUTH_URL;
export const apiUrl = import.meta.env.VITE_CTP_API_URL;
export const scopes = (import.meta.env.VITE_CTP_SCOPES || '').split(',');

export const tokenCache = {
  get: () => {
    try {
      return JSON.parse(localStorage.getItem('authTokens') || '{}');
    } catch {
      return {};
    }
  },
  set: (tokenData: TokenStore) => {
    localStorage.setItem('authTokens', JSON.stringify(tokenData));
  },
};

export const anonymousTokenCache = {
  get: () => {
    try {
      return JSON.parse(localStorage.getItem('anonTokens') || '{}');
    } catch {
      return {};
    }
  },
  set: (tokenData: TokenStore) => {
    localStorage.setItem('anonTokens', JSON.stringify(tokenData));
  },
};

export const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: authUrl,
  projectKey,
  credentials: {
    clientId,
    clientSecret,
  },
  scopes,
  tokenCache: tokenCache,
};

export const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiUrl,
};
