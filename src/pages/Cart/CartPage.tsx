import { useEffect, useState } from 'react';
import { Spinner } from '@heroui/react';

import { EmptyCart } from './EmptyCart';
import { ShopItems } from './ShopItems';

import { useCart } from '@/shared/context/CartContext';

export function CartPage() {
  const {
    cart,
    loading,
    clearCart,
    applyDiscounts,
    cancelDiscountById,
    error,
    cartDiscountByID,
  } = useCart();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!loading && cart) {
      setIsInitialized(true);
    }
  }, [loading, cart]);

  if (loading && !isInitialized) {
    return (
      <Spinner
        className="absolute left-1/2 top-[50dvh] -translate-x-1/2 -translate-y-1/2"
        label="Please wait"
        size="lg"
        variant="simple"
      />
    );
  }

  return (
    <div className="flex w-full select-none items-center justify-center">
      {cart && cart.lineItems.length > 0 ? (
        <ShopItems
          applyDiscounts={applyDiscounts}
          cancelDiscountById={cancelDiscountById}
          cart={cart}
          cartDiscountByID={cartDiscountByID}
          clear={clearCart}
          error={error}
          isLoading={loading}
        />
      ) : (
        <EmptyCart />
      )}
    </div>
  );
}
