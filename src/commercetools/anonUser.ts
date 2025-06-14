import { Client, ClientBuilder } from '@commercetools/ts-client';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

import {
  httpMiddlewareOptions,
  authUrl,
  projectKey,
  clientId,
  clientSecret,
  anonymousTokenCache,
} from './buildClient';



const anonUserClient: Client = new ClientBuilder()
  .withProjectKey(projectKey)
  .withAnonymousSessionFlow({
    host: authUrl,
    projectKey: projectKey,
    credentials: {
      clientId: clientId,
      clientSecret: clientSecret,
      // anonymousId: getAnonymousId(),

    },

    tokenCache: anonymousTokenCache,
  })
  .withHttpMiddleware(httpMiddlewareOptions)
  .build();

export const apiAnonRoot = createApiBuilderFromCtpClient(
  anonUserClient,
).withProjectKey({
  projectKey,
});
