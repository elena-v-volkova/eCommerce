import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Cart,
  ClientResponse,
  DiscountCode,
  DiscountCodePagedQueryResponse,
  ErrorResponse,
} from '@commercetools/platform-sdk';

import { clearCartId, getCartId, setCartId } from '../utils/anonymousId';
import {
  createAnonymousCart,
  getActiveCustomerCart,
  getCartById,
} from '../api/cart';
import { useAuth } from '../model/AuthContext';

import { apiAnonRoot } from '@/commercetools/anonUser';
import { createAuthClient } from '@/commercetools/authUser';
import { anonymousTokenCache, tokenCache } from '@/commercetools/buildClient';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addItem: (productId: string, variantId: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  updateItemQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  setCart: (cart: Cart | null) => void;
  discounts: DiscountCodePagedQueryResponse | null;
  error: string | null;
  applyDiscounts: (discountCode: string) => Promise<Cart | void>;
  cartDiscountByID: (discountId: string) => Promise<DiscountCode | void>;
  cancelDiscountById: (discountId: string) => Promise<Cart | void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [discounts, setDiscounts] =
    useState<DiscountCodePagedQueryResponse | null>(null);

  // Загрузка корзины при изменении пользователя
  useEffect(() => {
    loadCart();
  }, [user]);
  useEffect(() => {
    fetchDiscounts();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      if (user) {
        await loadCustomerCart();
      } else {
        await loadAnonymousCart();
      }
    } finally {
      setLoading(false);
    }
  };

  const loadCustomerCart = async () => {
    if (!user || !user.id) {
      return;
    }
    try {
      clearCartId();
      const customerCart = await getActiveCustomerCart(user.id);

      if (customerCart && customerCart.results?.length > 0) {
        setCart(customerCart.results[0]);
        setCartId(customerCart.results[0].id);
      } else {
        // Если у пользователя нет корзины, создаем новую
        const authClient = createAuthClient(tokenCache.get().token);
        const newCart = await authClient
          .me()
          .carts()
          .post({
            body: {
              currency: 'USD',
              country: 'US',
              taxMode: 'Platform',
            },
          })
          .execute();

        setCart(newCart.body);
        setCartId(newCart.body.id);
      }
    } catch (error) {
      throw error;
    }
  };

  const loadAnonymousCart = async () => {
    try {
      const existingId = getCartId();

      if (existingId) {
        try {
          const anonCart = await getCartById(existingId);

          setCart(anonCart);
        } catch (e) {
          const newCart = await createAnonymousCart();

          setCart(newCart);
          setCartId(newCart.id);
          throw e;
        }
      } else {
        const newCart = await createAnonymousCart();

        setCart(newCart);
        setCartId(newCart.id);
      }
    } catch (error) {
      throw error;
    }
  };

  const addItem = async (productId: string, variantId: number) => {
    if (!cart) {
      return;
    }

    try {
      setLoading(true);

      const endpoint = user?.id
        ? createAuthClient(tokenCache.get().token)
            .me()
            .carts()
            .withId({ ID: cart.id })
        : apiAnonRoot.carts().withId({ ID: cart.id });

      const updatedCart = await endpoint
        .post({
          body: {
            version: cart.version,
            actions: [
              {
                action: 'addLineItem',
                productId,
                variantId,
                quantity: 1,
              },
            ],
          },
        })
        .execute();

      setCart(updatedCart.body);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (lineItemId: string) => {
    if (!cart) {
      return;
    }

    try {
      setLoading(true);

      const endpoint = user?.id
        ? createAuthClient(tokenCache.get().token)
            .me()
            .carts()
            .withId({ ID: cart.id })
        : apiAnonRoot.carts().withId({ ID: cart.id });

      const res = await endpoint
        .post({
          body: {
            version: cart.version,
            actions: [{ action: 'removeLineItem', lineItemId }],
          },
        })
        .execute();

      setCart(res.body);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (lineItemId: string, quantity: number) => {
    if (!cart) {
      return;
    }

    try {
      setLoading(true);

      const endpoint = user?.id
        ? createAuthClient(tokenCache.get().token)
            .me()
            .carts()
            .withId({ ID: cart.id })
        : apiAnonRoot.carts().withId({ ID: cart.id });

      const res = await endpoint
        .post({
          body: {
            version: cart.version,
            actions: [
              {
                action: 'changeLineItemQuantity',
                lineItemId,
                quantity,
              },
            ],
          },
        })
        .execute();

      setCart(res.body);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!cart) {
      return;
    }

    try {
      setLoading(true);

      const actions = cart.lineItems.map((item) => ({
        action: 'removeLineItem' as const,
        lineItemId: item.id,
      }));

      if (actions.length === 0) {
        return;
      }

      const endpoint = user?.id
        ? createAuthClient(tokenCache.get().token)
            .me()
            .carts()
            .withId({ ID: cart.id })
        : apiAnonRoot.carts().withId({ ID: cart.id });

      const res = await endpoint
        .post({
          body: {
            version: cart.version,
            actions,
          },
        })
        .execute();

      setCart(res.body);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscounts =
    async (): Promise<DiscountCodePagedQueryResponse | void> => {
      const TOKEN: string =
        tokenCache.get().token || anonymousTokenCache.get().token;

      setLoading(true);

      return await createAuthClient(TOKEN)
        .discountCodes()
        .get()
        .execute()
        .then((data) => {
          setError(null);
          setDiscounts(data.body);
        })
        .catch((error: ErrorResponse) => {
          setError(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };

  const applyDiscounts = async (discountCode: string): Promise<Cart | void> => {
    const TOKEN: string =
      tokenCache.get().token || anonymousTokenCache.get().token;

    setLoading(true);

    return await createAuthClient(TOKEN)
      .carts()
      .withId({ ID: cart?.id || '' })
      .post({
        body: {
          version: cart?.version || 0,
          actions: [
            {
              action: 'addDiscountCode',
              code: discountCode,
            },
          ],
        },
      })
      .execute()
      .then((data: ClientResponse<Cart>) => {
        setCart(data.body);
        setError(null);

        return data.body;
      })
      .catch((error: ErrorResponse) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const cancelDiscountById = async (
    discountId: string,
  ): Promise<Cart | void> => {
    const TOKEN: string =
      tokenCache.get().token || anonymousTokenCache.get().token;

    setLoading(true);

    return await createAuthClient(TOKEN)
      .carts()
      .withId({ ID: cart?.id || '' })
      .post({
        body: {
          version: cart?.version || 0,
          actions: [
            {
              action: 'removeDiscountCode',
              discountCode: {
                typeId: 'discount-code',
                id: discountId,
              },
            },
          ],
        },
      })
      .execute()
      .then((data: ClientResponse<Cart>) => {
        setCart(data.body);
        setError(null);

        return data.body;
      })
      .catch((error: ErrorResponse) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const cartDiscountByID = async (
    discountId: string,
  ): Promise<DiscountCode | void> => {
    const TOKEN: string =
      tokenCache.get().token || anonymousTokenCache.get().token;

    setLoading(true);

    return await createAuthClient(TOKEN)
      .discountCodes()
      .withId({ ID: discountId })
      .get()
      .execute()
      .then((data) => {
        setError(null);

        return data.body;
      })
      .catch((error: ErrorResponse) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const value: CartContextType = {
    cart,
    loading,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    setCart,
    discounts,
    error,
    applyDiscounts,
    cartDiscountByID,
    cancelDiscountById,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
