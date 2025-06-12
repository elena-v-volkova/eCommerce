import { Cart } from '@commercetools/platform-sdk';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Button,
  Input,
} from '@heroui/react';
import { useEffect, useState } from 'react';

type TAsideCard = {
  subTotal: number;
  clearCart: () => Promise<void>;
  applyDiscounts: (discountCode: string) => Promise<Cart | void>;
  error: string | null;
};

export function AsideCard({
  subTotal,
  clearCart,
  applyDiscounts,
  error,
}: TAsideCard) {
  const formatPrice = (centAmount: number, currency: string = 'USD') => {
    return (centAmount / 100).toLocaleString('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };
  const [total, setTotal] = useState<string>(formatPrice(subTotal));
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    let amount = formatPrice(subTotal);

    setTotal(amount);
  }, [subTotal]);

  return (
    <Card className="min-w-[300px]  max-w-[400px] self-center md:self-start">
      <CardHeader className="flex items-stretch gap-3 text-lg font-bold">
        <p className="inline-block text-default-500">Subtotal</p>
        <p className="inline-block  text-black">{total}</p>
      </CardHeader>
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
