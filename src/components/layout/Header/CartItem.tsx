import { Button, Link } from '@heroui/react';
import { ShoppingCart, BaggageClaim } from 'lucide-react';

import { AppRoute } from '@/routes/appRoutes';
import { useCart } from '@/shared/context/CartContext';

export function CartItem() {
  const { cart } = useCart();

  return (
    <Button
      isIconOnly
      as={Link}
      href={AppRoute.cart}
      radius="full"
      size="md"
      variant="ghost"
    >
      {cart && cart.lineItems.length > 0 ? (
        <BaggageClaim color="#006fee" size={24} strokeWidth={2} />
      ) : (
        <ShoppingCart color="#006fee" size={24} strokeWidth={2} />
      )}
    </Button>
  );
}
