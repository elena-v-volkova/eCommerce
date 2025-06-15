import {
  TokenCache,
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

export const anonymousTokenCache: TokenCache = {
  get: (): TokenStore => {
    try {
      const cachedToken = localStorage.getItem('anonTokens');

      if (cachedToken) {
        const parsedToken = JSON.parse(cachedToken);

        // Проверяем, что возвращаемый объект соответствует TokenStore
        if (
          parsedToken &&
          typeof parsedToken.token === 'string' &&
          typeof parsedToken.expirationTime === 'number'
        ) {
          return parsedToken as TokenStore;
        }
      }
    } catch (e) {
      console.warn('Failed to parse anonymous token from localStorage:', e);
    }

    // Возвращаем дефолтный TokenStore, если токен отсутствует или некорректен
    return { token: '', expirationTime: 0, refreshToken: '' };
  },
  set: (tokenData: TokenStore) => {
    try {
      localStorage.setItem('anonTokens', JSON.stringify(tokenData));
    } catch (e) {
      console.error('Failed to save anonymous token to localStorage:', e);
    }
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
