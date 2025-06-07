import { ClientBuilder } from '@commercetools/ts-client';
import {
  authMiddlewareOptions,
  httpMiddlewareOptions,
  projectKey,
} from './buildClient';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

export const client = new ClientBuilder()
  .withProjectKey(projectKey)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  // .withLoggerMiddleware()
  .build();

export const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({
  projectKey,
});
