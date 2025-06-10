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

export function AsideCard({ subTotal }: { subTotal: Map<string, number> }) {
  const formatPrice = (centAmount: number, currency: string = 'USD') => {
    return (centAmount / 100).toLocaleString('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };
  const [total, setTotal] = useState<string>(
    formatPrice([...subTotal.values()].reduce((acc, value) => acc + value, 0)),
  );

  useEffect(() => {
    let amount = formatPrice(
      [...subTotal.values()].reduce((acc, value) => acc + value, 0),
    );

    setTotal(amount);
  }, [subTotal]);

  return (
    <Card className="min-w-[300px]  max-w-[400px] self-start">
      <CardHeader className="flex items-stretch gap-3 text-lg font-bold">
        <p className="inline-block text-default-500">Subtotal</p>
        <p className="inline-block  text-black">{total}</p>
      </CardHeader>
      <Divider />
      <CardBody className="gap-2">
        <Input
          className=" "
          label="Promo Code"
          type="text"
          variant="bordered"
        />
        <Button
          className="w-[200px]   uppercase"
          color="default"
          radius="full"
          variant="flat"
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
        >
          Clear shopping cart
        </Button>
      </CardFooter>
    </Card>
  );
}
