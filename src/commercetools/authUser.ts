import {
  ClientBuilder,
  ExistingTokenMiddlewareOptions,
} from '@commercetools/ts-client';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

import {
  authUrl,
  clientId,
  clientSecret,
  httpMiddlewareOptions,
  projectKey,
  tokenCache,
} from './buildClient';

const options: ExistingTokenMiddlewareOptions = {
  force: true,
};

export const createAuthClient = (refreshToken: string) => {
  const authUserClient = new ClientBuilder()
    .withProjectKey(projectKey)
    .withRefreshTokenFlow({
      refreshToken,
      projectKey,
      credentials: {
        clientId,
        clientSecret,
      },
      tokenCache,
      host: authUrl,
    })

    .withHttpMiddleware(httpMiddlewareOptions)
    .build();

  return createApiBuilderFromCtpClient(authUserClient).withProjectKey({
    projectKey,
  });
};
