import {
  Cart,
  CartDraft,
  CartPagedQueryResponse,
} from '@commercetools/platform-sdk';

import { apiAnonRoot } from '@/commercetools/anonUser';
import { createAuthClient } from '@/commercetools/authUser';
import { tokenCache } from '@/commercetools/buildClient';

interface CartResponse extends CartPagedQueryResponse {
  count: number;
  limit: number;
  offset: number;
  results: Cart[];
}

export async function createAnonymousCart(): Promise<Cart> {
  const cartDraft: CartDraft = {
    currency: 'USD',
    country: 'US',

    // anonymousId: getAnonymousId(),

    taxMode: 'Platform',
  };

  try {
    const response = await apiAnonRoot
      .carts()
      .post({ body: cartDraft })
      .execute();

    return response.body;
  } catch (error) {
    throw error;
  }
}

export async function getActiveCustomerCart(
  customerId: string,
): Promise<CartResponse> {
  const apiAuthRoot = createAuthClient(
    tokenCache.get().token,
    tokenCache.get().refreshToken,
  );

  const res = await apiAuthRoot
    .carts()
    .get({
      queryArgs: {
        where: `customerId="${customerId}" and cartState="Active"`,
        limit: 1,
      },
    })
    .execute();

  return res.body;
}

export async function getCartById(id: string) {
  const res = await apiAnonRoot.carts().withId({ ID: id }).get().execute();

  return res.body;
}
