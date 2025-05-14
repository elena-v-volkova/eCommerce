import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import {
  ClientBuilder,
  type AuthMiddlewareOptions, // Required for auth
  type HttpMiddlewareOptions, // Required for sending HTTP requests
} from '@commercetools/ts-client';
// import fetch from 'node-fetch';

import {
  apiUrl,
  authUrl,
  clientId,
  clientSecret,
  projectKey,
  scopes,
} from './buildClient';

import { CustomerDraft } from '@/types/commercetools';
import { TRegisterFieldsSchema } from '@/components/RegisterForm/lib/registerSchema';

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: authUrl,
  projectKey: projectKey,
  credentials: {
    clientId: clientId,
    clientSecret: clientSecret,
  },
  scopes,
  httpClient: fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiUrl,
  httpClient: fetch,
};

// Export the ClientBuilder
export const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware() // Include middleware for logging
  .build();

// Create apiRoot from the imported ClientBuilder and include your Project key
export const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: projectKey,
});

export async function createCustomer(
  obj: TRegisterFieldsSchema,
  sameAddress: boolean,
) {
  const data = prepareData(obj, sameAddress);

  return apiRoot
    .customers()
    .post({
      body: data,
    })
    .execute();
}

export function prepareData(
  input: TRegisterFieldsSchema,
  sameAddress: boolean,
): CustomerDraft {
  const address = {
    ...input.address,
    firstName: input.firstName,
    lastName: input.lastName,
  };
  const billingAddress = {
    ...input.billingAddress,
    firstName: input.firstName,
    lastName: input.lastName,
  };

  return {
    email: input.email,
    password: input.password,
    firstName: input.firstName,
    lastName: input.lastName,
    dateOfBirth: input.dateOfBirth.toString(),
    addresses: [address, billingAddress],
    defaultShippingAddress: 0,
    defaultBillingAddress: Number(!sameAddress),
  };
}
