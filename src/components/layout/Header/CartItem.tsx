import { Button, Link } from '@heroui/react';
import { ShoppingCart } from 'lucide-react';

import { AppRoute } from '@/routes/appRoutes';
import { useCart } from '@/shared/context/CartContext';

export function CartItem() {
  const { cart } = useCart();

  return (
    <Button
      isIconOnly
      as={Link}
      color="primary"
      href={AppRoute.cart}
      radius="full"
      size="md"
      variant="flat"
    >
      {cart && cart.lineItems.length > 0 ? (
        <>
          {' '}
          <ShoppingCart
            className="relative left-1/4 top-3 -translate-x-1/2  -translate-y-1/2 "
            color="#fff"
            size={24}
            strokeWidth={2}
          />
          <div className="text-blue absolute left-1/2 top-1/2  -translate-x-1/2 -translate-y-1/2  font-extrabold">
            {(cart.totalLineItemQuantity ?? 0) > 1000
              ? '999+'
              : cart.totalLineItemQuantity}
          </div>
        </>
      ) : (
        <ShoppingCart color="#006fee" size={24} strokeWidth={2} />
      )}
    </Button>
  );
}
