import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from '@commercetools/ts-client';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

export const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY || '';
export const clientId = import.meta.env.VITE_CTP_CLIENT_ID || '';
export const clientSecret = import.meta.env.VITE_CTP_CLIENT_SECRET || '';
export const authUrl = import.meta.env.VITE_CTP_AUTH_URL;
export const apiUrl = import.meta.env.VITE_CTP_API_URL;
export const scopes = (import.meta.env.VITE_CTP_SCOPES || '').split(',');

console.log(import.meta.env);
console.log(clientSecret);

export const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: authUrl,
  projectKey,
  credentials: {
    clientId,
    clientSecret,
  },
  scopes,
};

export const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiUrl,
};

// export const ctpClient = new ClientBuilder()
//   .withProjectKey(projectKey)
//   .withClientCredentialsFlow(authMiddlewareOptions)
//   .withHttpMiddleware(httpMiddlewareOptions)
//   .withLoggerMiddleware()
//   .build();

// export const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
//   projectKey,
// });
