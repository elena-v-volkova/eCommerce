import {
  ClientBuilder,
  ExistingTokenMiddlewareOptions,
} from '@commercetools/ts-client';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

import { httpMiddlewareOptions, projectKey } from './buildClient';

const options: ExistingTokenMiddlewareOptions = {
  force: true,
};

// const authUserClient = new ClientBuilder()
//   .withProjectKey(projectKey)
//   .withExistingTokenFlow(`Bearer ${tokenCache.get().token}`, options)
//   .withHttpMiddleware(httpMiddlewareOptions)
//   .build();

// export const apiAuthRoot = createApiBuilderFromCtpClient(
//   authUserClient,
// ).withProjectKey({ projectKey });

export const createAuthClient = (token) => {
  const authUserClient = new ClientBuilder()
    .withProjectKey(projectKey)
    .withExistingTokenFlow(`Bearer ${token}`, options)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();

  return createApiBuilderFromCtpClient(authUserClient).withProjectKey({
    projectKey,
  });
};
