import { Minus, Plus, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Card, CardBody, Image, Button, Chip, Spinner } from '@heroui/react';
import {
  Attribute,
  Cart,
  DiscountCode,
  LineItem,
} from '@commercetools/platform-sdk';

import styles from './CartPage.module.scss';
import { AsideCard } from './AsideCard';
import { EmptyCart } from './EmptyCart';
import { PopoverCart } from './PopoverContent';

import { useCart } from '@/shared/context/CartContext';
import { formatPrice } from '@/shared/utils/utils';

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

function ShopItems({
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

interface ICartItemProps {
  initCount: number;
  item: LineItem;
  isLoading: boolean;
}

function CartItem({ initCount, item, isLoading }: ICartItemProps) {
  const { updateItemQuantity, removeItem, loading } = useCart();
  const [count, setCount] = useState<number>(initCount || 1);
  const MIN = 1;
  const MAX = 1000;
  const isInitial = useRef(true);
  const decrement = () => {
    if (count >= 2) {
      setCount(count - 1);
    }
  };
  const increment = () => setCount(count + 1);
  const handler = (input: number): void => {
    if (input > MIN && input < MAX) {
      setCount(input);
    }
  };

  const product = item;

  function calculatePercent(old: number, current: number): number | null {
    if (old === 0) return null;
    if (old === undefined || current === undefined) return null;

    return ((current - old) / Math.abs(old)) * 100;
  }
  const locale = 'en-US';
  const condition = product.variant.attributes
    ?.filter((item: Attribute) => item.name === 'condition')
    .map((item: Attribute) => item.value.label);
  const price = product.variant.prices?.[0].value.centAmount || 0;
  const discountedPrice =
    product.variant.prices?.[0].discounted?.value.centAmount || 0;
  const discount = calculatePercent(price, discountedPrice);

  const itemId = product.id;

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;

      return;
    }
    updateItemQuantity(itemId, count);
  }, [count]);

  const deleteHandler = async () => {
    await removeItem(itemId);
  };

  return (
    <Card
      isBlurred
      className="mb-2 w-full max-w-[600px] bg-background/60 dark:bg-default-100/50"
      shadow="sm"
    >
      <CardBody>
        <div className={styles.cart_body}>
          <div className="relative size-[200]">
            <Image
              alt="image"
              className="object-scale-down"
              height={150}
              shadow="sm"
              src={
                product.variant.images?.[0]?.url ??
                'https://upload.wikimedia.org/wikipedia/ru/thumb/a/ac/No_image_available.svg/250px-No_image_available.svg.png'
              }
              width={150}
            />

            {/* Discount Badge  */}
            {discount && (
              <Chip
                className="absolute left-2 top-2 z-10"
                color="danger"
                size="sm"
                variant="solid"
              >
                {discount}%
              </Chip>
            )}
            {/* Condition Badge */}
            <Chip
              className="absolute right-2 top-2 z-10 bg-black/50 capitalize text-white"
              color="default"
              size="sm"
              variant="solid"
            >
              {condition}
            </Chip>
          </div>

          <div className="">
            <div className="flex flex-col">
              {/* Title */}
              <h3 className="mb-2 line-clamp-1 text-small font-bold text-foreground">
                {product.name[`${locale}`]}
              </h3>
              {/* Price and Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-end gap-2">
                  {price && (
                    <span className="text-sm text-foreground-400 line-through">
                      {formatPrice(price)}
                    </span>
                  )}
                  <span className={`text-lg font-bold text-default-500`}>
                    {formatPrice(discountedPrice || 0)}
                  </span>
                </div>
              </div>
            </div>
            {/* setcount */}
            <div className="flex flex-col justify-start gap-2">
              <div className="flex w-[130px]">
                <button
                  className={`rounded-l-lg ${styles.count_button}`}
                  disabled={Boolean(isLoading)}
                  onClick={() => decrement()}
                >
                  <Minus color="black" strokeWidth={3} />
                </button>
                <input
                  className={styles.no_arrows}
                  max={MAX}
                  min={MIN}
                  type="number"
                  value={`${count}`}
                  onChange={(event) => handler(Number(event.target.value))}
                />
                <button
                  className={`rounded-r-lg ${styles.count_button}`}
                  disabled={Boolean(isLoading)}
                  onClick={() => increment()}
                >
                  <Plus color="black" strokeWidth={3} />
                </button>
                <PopoverCart
                  action={() => deleteHandler()}
                  isLoading={loading}
                  triggerButton={
                    <Button
                      isIconOnly
                      className="ml-4 sm:ml-8"
                      endContent={
                        <Trash2 absoluteStrokeWidth color="#f31260" />
                      }
                      radius="sm"
                      size="sm"
                      variant="light"
                    />
                  }
                />
              </div>
              <div className="text-lg font-bold">
                <p>Total price:</p>
                <span
                  className={`text-lg font-bold ${discountedPrice ? 'text-primary-500' : 'text-foreground'}`}
                >
                  {formatPrice(Math.min(price, discountedPrice) * count)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
