import {
  ClientBuilder,
  ExistingTokenMiddlewareOptions,
} from '@commercetools/ts-client';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

import { httpMiddlewareOptions, projectKey } from './buildClient';

const options: ExistingTokenMiddlewareOptions = {
  force: true,
};

export const createAuthClient = (token: string) => {
  const authUserClient = new ClientBuilder()
    .withProjectKey(projectKey)
    .withExistingTokenFlow(`Bearer ${token}`, options)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();

  return createApiBuilderFromCtpClient(authUserClient).withProjectKey({
    projectKey,
  });
};
