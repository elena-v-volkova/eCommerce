import { ClientBuilder } from '@commercetools/ts-client';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

import {
  authMiddlewareOptions,
  httpMiddlewareOptions,
  projectKey,
} from './buildClient';

export const anonUserClient = new ClientBuilder()
  .withProjectKey(projectKey)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  // .withLoggerMiddleware()
  .build();

export const apiAnonRoot = createApiBuilderFromCtpClient(
  anonUserClient,
).withProjectKey({
  projectKey,
});
