import { AppRoute } from '@/routes/appRoutes';
import { useCart } from '@/shared/context/CartContext';
import { Button, Link } from '@heroui/react';
import { ShoppingCart, BaggageClaim } from 'lucide-react';

export function CartItem() {
  const { cart } = useCart();

  return (
    <Button
      as={Link}
      href={AppRoute.cart}
      isIconOnly
      size="md"
      radius="full"
      variant="ghost"
    >
      {cart && cart.lineItems.length > 0 ? (
        <BaggageClaim size={24} strokeWidth={2} color="#006fee" />
      ) : (
        <ShoppingCart size={24} strokeWidth={2} color="#006fee" />
      )}
    </Button>
  );
}
