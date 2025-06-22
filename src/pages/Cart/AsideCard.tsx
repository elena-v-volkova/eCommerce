import { Cart, DiscountCode } from '@commercetools/platform-sdk';
import {
  Card,
  CardBody,
  CardFooter,
  Divider,
  Button,
  Input,
} from '@heroui/react';
import { Check } from 'lucide-react';
import { useState } from 'react';

import { PopoverCart } from './PopoverContent';
import { DiscountAmount } from './DiscountAmount';

import { formatPrice } from '@/shared/utils/utils';

type TAsideCard = {
  clearCart: () => Promise<void>;
  applyDiscounts: (discountCode: string) => Promise<Cart | void>;
  error: string | null;
  cart: Cart;
  cartDiscountByID: (discountId: string) => Promise<DiscountCode | void>;
  cancelDiscountById: (discountId: string) => Promise<Cart | void>;
  isLoading: boolean;
};

export function AsideCard({
  clearCart,
  applyDiscounts,
  error,
  cart,
  cartDiscountByID,
  cancelDiscountById,
  isLoading,
}: TAsideCard) {
  const [code, setCode] = useState<string>('');

  return (
    <Card className="min-w-[300px]  max-w-[400px] self-center md:self-start">
      <div className="flex flex-col content-stretch p-[12px] text-lg font-bold">
        {cart.discountOnTotalPrice && (
          <DiscountAmount
            cancelDiscountById={cancelDiscountById}
            cart={cart}
            cartDiscountByID={cartDiscountByID}
          />
        )}
        <div className="flex content-stretch gap-3">
          <p className="inline-block text-default-500">
            {cart.discountOnTotalPrice ? 'Subtotal' : 'Total'}
          </p>
          <p className="inline-block  text-black dark:text-white">
            {formatPrice(cart.totalPrice.centAmount)}
          </p>
        </div>
      </div>
      <Divider />
      <CardBody className="gap-2">
        <p className="font-thin text-red-500">{error ? error : ''}</p>
        <Input
          defaultValue={''}
          endContent={
            code ? (
              <Button
                isIconOnly
                className="w-[50px]  uppercase"
                color="success"
                radius="full"
                variant="flat"
                onClick={() => applyDiscounts(code).finally(() => setCode(''))}
              >
                <Check strokeWidth={3} />
              </Button>
            ) : undefined
          }
          label="Promo Code"
          type="text"
          value={code}
          variant="bordered"
          onValueChange={(value: string) => setCode(value)}
        />
      </CardBody>
      <Divider />
      <CardFooter>
        <PopoverCart
          action={() => clearCart()}
          isLoading={isLoading}
          triggerButton={
            <Button
              className="w-[200px] font-bold uppercase"
              color="warning"
              radius="full"
              variant="light"
            >
              Clear shopping cart
            </Button>
          }
        />
      </CardFooter>
    </Card>
  );
}
