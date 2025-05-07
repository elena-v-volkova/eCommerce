import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from '@commercetools/ts-client';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY || '';
const clientId = import.meta.env.VITE_CTP_CLIENT_ID || '';
const clientSecret = import.meta.env.VITE_CTP_CLIENT_SECRET || '';
const authUrl = import.meta.env.VITE_CTP_AUTH_URL;
const apiUrl = import.meta.env.VITE_CTP_API_URL;
const scopes = (import.meta.env.VITE_CTP_SCOPES || '').split(',');

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: authUrl,
  projectKey,
  credentials: {
    clientId,
    clientSecret,
  },
  scopes,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiUrl,
};

export const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey,
});

const anonCtpClient = new ClientBuilder()
  .withProjectKey(projectKey)
  .withAnonymousSessionFlow(authMiddlewareOptions)
  .withHttpMiddleware({ host: apiUrl })
  .build();

export const anonApiRoot = createApiBuilderFromCtpClient(
  anonCtpClient,
).withProjectKey({ projectKey });
