import { Cart, DiscountCode } from '@commercetools/platform-sdk';

import { AsideCard } from './AsideCard';
import { CartItem } from './CartItem';

export function ShopItems({
  cart,
  clear,
  isLoading,
  applyDiscounts,
  error,
  cartDiscountByID,
  cancelDiscountById,
}: {
  cart: Cart;
  clear: () => Promise<void>;
  isLoading: boolean;
  applyDiscounts: (discountCode: string) => Promise<Cart | void>;
  error: string | null;
  cartDiscountByID: (discountId: string) => Promise<DiscountCode | void>;
  cancelDiscountById: (discountId: string) => Promise<Cart | void>;
}) {
  return (
    <div className="flex w-full max-w-[900px] flex-col-reverse items-center gap-4 md:flex-row md:items-start">
      <div className="flex w-full max-w-[470px] flex-col">
        {cart.lineItems.map((lineItem) => (
          <CartItem
            key={lineItem.id}
            initCount={lineItem.quantity}
            isLoading={isLoading}
            item={lineItem}
          />
        ))}
      </div>
      <AsideCard
        applyDiscounts={applyDiscounts}
        cancelDiscountById={cancelDiscountById}
        cart={cart}
        cartDiscountByID={cartDiscountByID}
        clearCart={clear}
        error={error}
        isLoading={isLoading}
      />
    </div>
  );
}
