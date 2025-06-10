import { ClientBuilder } from '@commercetools/ts-client';
import {
  ByProjectKeyRequestBuilder,
  Cart,
  CartDraft,
  ClientResponse,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';

import {
  projectKey,
  clientId,
  scopes,
  httpMiddlewareOptions,
  clientSecret,
  authMiddlewareOptions,
} from './buildClient';

class CustomerClient {
  private _client: ByProjectKeyRequestBuilder | null = null;
  private _isInitialized: boolean = false;
  private _cartDraft: CartDraft = {
    currency: 'USD',
    locale: 'EN',
    country: 'UK',
  };

  public setPasswordClient(username: string, password: string): void {
    if (!username || !password) {
      throw new Error('clientId and clientSecret are required');
    }
    this._isInitialized = true;

    this._client = createApiBuilderFromCtpClient(
      new ClientBuilder()
        .withProjectKey(projectKey)
        .withPasswordFlow({
          ...authMiddlewareOptions,
          credentials: {
            clientId: clientId,
            clientSecret: clientSecret,
            user: {
              username: username,
              password: password,
            },
          },
          scopes,
        })
        .withHttpMiddleware(httpMiddlewareOptions)
        .build(),
    ).withProjectKey({
      projectKey,
    });
  }

  public get builder(): ByProjectKeyRequestBuilder | null {
    if (!this._isInitialized) {
      throw new Error('Client not initialized');
    }

    return this._client;
  }
  public get reset(): boolean {
    this._client = null;
    this._isInitialized = false;

    return true;
  }
  public async createCart(
    cart: CartDraft,
  ): Promise<ClientResponse<Cart> | null> {
    if (this._client)
      return await this._client
        .me()
        .carts()
        .post({ body: cart || this._cartDraft })
        .execute();

    return null;
  }
}
