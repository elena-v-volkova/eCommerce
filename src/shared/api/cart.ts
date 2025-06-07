import { anonUserClient, apiAnonRoot } from '@/commercetools/anonUser';
import { CartDraft } from '@commercetools/platform-sdk';

async function createAnonymousCart() {
  const cartDraft: CartDraft = {
    currency: 'USD',
    country: 'US',
    inventoryMode: 'None',
  };

  try {
    const response = await apiAnonRoot
      .carts()
      .post({ body: cartDraft })
      .execute();
    console.log('Anonymous Cart Created:', response.body);
    return response.body;
  } catch (error) {
    console.error('Error creating anonymous cart:', error);
  }
}

async function getAnonymousCart(cartId: string) {
  try {
    const response = await apiAnonRoot
      .carts()
      .withId({ id: cartId })
      .get()
      .execute();
    console.log('Anonymous Cart:', response.body);
    return response.body;
  } catch (error) {
    console.error('Error fetching anonymous cart:', error);
  }
}
