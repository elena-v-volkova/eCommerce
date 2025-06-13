import { Cart, DiscountCode } from '@commercetools/platform-sdk';
import {
  Card,
  CardBody,
  CardFooter,
  Divider,
  Button,
  Input,
} from '@heroui/react';
import { useEffect, useState } from 'react';

type TAsideCard = {
  clearCart: () => Promise<void>;
  applyDiscounts: (discountCode: string) => Promise<Cart | void>;
  error: string | null;
  cart: Cart;
  cartDiscountByID: (discountId: string) => Promise<DiscountCode | void>;
};

export function AsideCard({
  clearCart,
  applyDiscounts,
  error,
  cart,
  cartDiscountByID,
}: TAsideCard) {
  const formatPrice = (centAmount: number, currency: string = 'USD') => {
    return (centAmount / 100).toLocaleString('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };
  const [code, setCode] = useState<string>('');

  const [discounts, setDiscounts] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    if (cart.discountOnTotalPrice) {
      const discounts = cart.discountOnTotalPrice.includedDiscounts;

      cart.discountCodes.forEach((item, index) => {
        cartDiscountByID(item.discountCode.id).then((data) => {
          if (data) {
            const discounted = formatPrice(
              discounts[index].discountedAmount.centAmount,
            );

            setDiscounts((prev) =>
              new Map(prev).set(data.code, `-${discounted}`),
            );
          }
        });
      });
    }
  }, [cart.discountOnTotalPrice]);

  return (
    <Card className="min-w-[300px]  max-w-[400px] self-center md:self-start">
      <div className="flex flex-col content-stretch p-[12px] text-lg font-bold">
        {discounts.size > 0 && (
          <>
            {cart.discountOnTotalPrice && (
              <div className="flex gap-3  text-default-400">
                <p>Total</p>
                <p className=" decoration-3 line-through decoration-red-500 decoration-solid">
                  {formatPrice(
                    cart.totalPrice.centAmount +
                      cart.discountOnTotalPrice.discountedAmount.centAmount,
                  )}
                </p>
              </div>
            )}
            {Array.from(discounts.entries()).map(([key, value]) => (
              <div key={key} className="flex  gap-3 text-sm">
                <p className="text-default-300">{key}</p>
                <p className="text-default-300">{value}</p>
              </div>
            ))}
          </>
        )}
        <div className="flex content-stretch gap-3">
          <p className="inline-block text-default-500">Subtotal</p>
          <p className="inline-block  text-black">
            {formatPrice(cart.totalPrice.centAmount)}
          </p>
        </div>
      </div>
      <Divider />
      <CardBody className="gap-2">
        <p>{error ? error : ''}</p>
        <Input
          defaultValue={''}
          label="Promo Code"
          type="text"
          variant="bordered"
          onValueChange={(value: string) => setCode(value)}
        />
        <Button
          className="w-[50px]   uppercase"
          color="default"
          radius="full"
          variant="flat"
          onClick={() => applyDiscounts(code)}
        >
          Apply
        </Button>
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
