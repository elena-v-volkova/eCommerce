import {
  TokenStore,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from '@commercetools/ts-client';

export const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY || '';
export const clientId = import.meta.env.VITE_CTP_CLIENT_ID || '';
export const clientSecret = import.meta.env.VITE_CTP_CLIENT_SECRET || '';
export const authUrl = import.meta.env.VITE_CTP_AUTH_URL;
export const apiUrl = import.meta.env.VITE_CTP_API_URL;
export const scopes = (import.meta.env.VITE_CTP_SCOPES || '').split(',');

const tokenCacheAnon = {
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
  tokenCache: tokenCacheAnon,
};

export const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiUrl,
};
