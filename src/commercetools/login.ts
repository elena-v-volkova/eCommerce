import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk'; // Vor ./buildClient
import {
  Client,
  ClientBuilder,
  PasswordAuthMiddlewareOptions,
} from '@commercetools/ts-client';

import {
  authUrl,
  clientId,
  clientSecret,
  httpMiddlewareOptions,
  projectKey,
  scopes,
  tokenCache,
} from './buildClient';

export function createPasswordFlowClient(email: string, password: string) {
  if (!email || !password) {
    throw new Error('Username and password are required');
  }

  const passwordFlowOptions: PasswordAuthMiddlewareOptions = {
    host: authUrl,
    projectKey: projectKey,
    credentials: {
      clientId: clientId,
      clientSecret: clientSecret,
      user: {
        username: email,
        password: password,
      },
    },
    scopes: scopes,
    tokenCache: tokenCache,
  };

  const client: Client = new ClientBuilder()
    .withPasswordFlow(passwordFlowOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    // .withLoggerMiddleware()
    .build();

  return createApiBuilderFromCtpClient(client).withProjectKey({ projectKey });
}
