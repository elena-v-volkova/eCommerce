import { Cart, DiscountCode } from '@commercetools/platform-sdk';
import {
  Card,
  CardBody,
  CardFooter,
  Divider,
  Button,
  Input,
} from '@heroui/react';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { formatPrice } from '@/shared/utils/utils';

type TAsideCard = {
  clearCart: () => Promise<void>;
  applyDiscounts: (discountCode: string) => Promise<Cart | void>;
  error: string | null;
  cart: Cart;
  cartDiscountByID: (discountId: string) => Promise<DiscountCode | void>;
  cancelDiscountById: (discountId: string) => Promise<Cart | void>;
};

type MyDiscount = {
  amount: string;
  id: string;
};

export function AsideCard({
  clearCart,
  applyDiscounts,
  error,
  cart,
  cartDiscountByID,
  cancelDiscountById,
}: TAsideCard) {
  const [code, setCode] = useState<string>('');

  const [discounts, setDiscounts] = useState<Map<string, MyDiscount>>(
    new Map(),
  );

  useEffect(() => {
    if (cart.discountOnTotalPrice) {
      const includedDiscounts = cart.discountOnTotalPrice.includedDiscounts;

      cart.discountCodes.forEach((item, index) => {
        cartDiscountByID(item.discountCode.id).then((data) => {
          if (data) {
            const discounted = formatPrice(
              includedDiscounts[index].discountedAmount.centAmount,
            );

            setDiscounts((prev) =>
              new Map(prev).set(data.code, {
                amount: `-${discounted}`,
                id: cart.discountCodes[index].discountCode.id,
              }),
            );
          }
        });
      });
    } else {
      setDiscounts(new Map());
    }
  }, [cart.discountOnTotalPrice?.includedDiscounts.length]);

  return (
    <Card className="min-w-[300px]  max-w-[400px] self-center md:self-start">
      <div className="flex flex-col content-stretch p-[12px] text-lg font-bold">
        {cart.discountOnTotalPrice && (
          <>
            <div className="flex items-stretch justify-between text-default-400">
              <p>Total</p>
              <p className="decoration-3 line-through decoration-red-500 decoration-solid">
                {formatPrice(
                  cart.totalPrice.centAmount +
                    cart.discountOnTotalPrice.discountedAmount.centAmount,
                )}
              </p>
            </div>
            {Array.from(discounts.entries()).map(([key, value], index) => (
              <div
                key={key}
                className="flex items-stretch justify-between text-sm"
              >
                <p className="text-default-300">{key}</p>
                <div className="inline-flex gap-2">
                  <p className="text-default-300">
                    -
                    {formatPrice(
                      cart.discountOnTotalPrice?.includedDiscounts[index]
                        .discountedAmount.centAmount || 0,
                    )}
                  </p>
                  <button
                    className="flex size-[20px] items-center justify-center rounded-full border-2 hover:border-slate-400"
                    onClick={() => {
                      cancelDiscountById(value.id).then((response) => {
                        if (response) {
                          setDiscounts(new Map());
                        }
                      });
                    }}
                  >
                    <X size={10} strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))}
            <Divider className="my-1" />
          </>
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
        {/* <Button
          className="w-[50px]   uppercase"
          color="default"
          radius="full"
          variant="flat"
          onClick={() => applyDiscounts(code)}
        >
          Apply
        </Button> */}
      </CardBody>
      <Divider />
      <CardFooter>
        <Button
          className="w-[200px] font-bold uppercase"
          color="warning"
          radius="full"
          variant="light"
          onClick={clearCart}
        >
          Clear shopping cart
        </Button>
      </CardFooter>
    </Card>
  );
}
