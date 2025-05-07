import { Client, ClientBuilder, TokenCache } from '@commercetools/ts-client';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk'; // Vor ./buildClient

// import type { ApiRoot } from '@commercetools/ts-client';
import {
  authUrl,
  clientId,
  clientSecret,
  httpMiddlewareOptions,
  projectKey,
  scopes,
} from './buildClient';

type PasswordAuthMiddlewareOptions = {
  host: string;
  projectKey: string;
  credentials: {
    clientId: string;
    clientSecret: string;
    user: {
      username: string;
      password: string;
    };
  };
  scopes?: Array<string>;
  tokenCache?: TokenCache;
  oauthUri?: string;
  fetch?: any;
};

export function createPasswordFlowClient(username: string, password: string) {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  const passwordFlowOptions: PasswordAuthMiddlewareOptions = {
    host: authUrl,
    projectKey: projectKey,
    credentials: {
      clientId: clientId,
      clientSecret: clientSecret,
      user: {
        username: username,
        password: password,
      },
    },
    scopes: scopes,
  };

  const client: Client = new ClientBuilder()
    .withPasswordFlow(passwordFlowOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();

  return createApiBuilderFromCtpClient(client).withProjectKey({ projectKey });
}
