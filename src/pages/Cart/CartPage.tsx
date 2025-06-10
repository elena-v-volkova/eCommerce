import { Minus, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Image,
  Button,
  Chip,
} from '@heroui/react';
import { Attribute, ProductData } from '@commercetools/platform-sdk';

import styles from './CartPage.module.scss';
import { AsideCard } from './AsideCard';
import { mockA, mockB } from './mock';

export function CartPage() {
  return (
    <div className="flex w-full select-none   items-center justify-center ">
      <ShopItems />
    </div>
  );
}

function ShopItems() {
  const [total, setTotal] = useState<Map<string, number>>(new Map());
  const updateItemCost = (id: string, value: number) => {
    console.log(total);
    setTotal((prev) => new Map(prev).set(id, value));
  };

  useEffect(() => {
    console.log(total);
  }, [total]);

  return (
    <div className="flex w-full max-w-[900px] flex-col-reverse items-center gap-4 md:flex-row ">
      <div className="flex w-full flex-col   ">
        <CartItem id="123" initCount={1} item={mockB} update={updateItemCost} />
        <CartItem id="345" initCount={1} item={mockA} update={updateItemCost} />
      </div>
      <AsideCard subTotal={total} />
    </div>
  );
}
interface MyProduct extends ProductData {
  id: string;
}

interface ICartItemProps {
  initCount: number;
  id: string;
  item: MyProduct;
  update: (id: string, value: number) => void;
}

function CartItem({ initCount, id, update, item }: ICartItemProps) {
  const [count, setCount] = useState<number>(initCount || 1);
  const MIN = 1;
  const MAX = 1000;
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
  // const product: MyProduct = JSON.parse(import.meta.env.VITE_MOCK_CAR);
  const product = item;
  const formatPrice = (centAmount: number, currency: string = 'USD') => {
    return (centAmount / 100).toLocaleString('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  function calculatePercent(old: number, current: number): number | null {
    if (old === 0) return null;
    if (old === undefined || current === undefined) return null;

    return ((current - old) / Math.abs(old)) * 100;
  }
  const locale = 'en-US';
  const condition = product.masterVariant.attributes
    ?.filter((item: Attribute) => item.name === 'condition')
    .map((item: Attribute) => item.value.label);
  const price = product.masterVariant.prices?.[0].value.centAmount || 0;
  const discountedPrice =
    product.masterVariant.prices?.[0].discounted?.value.centAmount || 0;
  const discount = calculatePercent(price, discountedPrice);

  const itemId = product.id.toString() || '';

  useEffect(() => {
    update(itemId, Math.min(price, discountedPrice) * count);
  }, [count]);

  const popoverContent = (
    <PopoverContent>
      <div className="px-1 py-2">
        <div className="  text-small font-bold">
          <p className="my-1">Are you sure?</p>
        </div>
        <Button isIconOnly className="mx-1 text-small font-bold">
          Yes
        </Button>
        <Button isIconOnly className="mx-1 text-small font-bold">
          No
        </Button>
      </div>
    </PopoverContent>
  );

  return (
    <Card
      isBlurred
      className="start mb-2  w-full max-w-[600px]  bg-background/60 dark:bg-default-100/50  "
      shadow="sm"
    >
      <CardBody>
        <div className={styles.cartBody}>
          <div className="relative size-[200] ">
            <Image
              alt="image"
              className="object-scale-down"
              height={150}
              shadow="sm"
              src={
                product.masterVariant.images?.[0]?.url ??
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
            <div className=" flex flex-col  ">
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
                  className={`rounded-l-lg ${styles.countButton}`}
                  onClick={() => decrement()}
                >
                  <Minus color="black" strokeWidth={3} />
                </button>
                <input
                  className={styles.noArrows}
                  max={MAX}
                  min={MIN}
                  type="number"
                  value={`${count}`}
                  onChange={(event) => handler(Number(event.target.value))}
                />
                <button
                  className={`rounded-r-lg ${styles.countButton}`}
                  onClick={() => increment()}
                >
                  <Plus color="black" strokeWidth={3} />
                </button>
                <Popover color="default" placement="top">
                  <PopoverTrigger>
                    <Button
                      isIconOnly
                      className="ml-4 sm:ml-8"
                      endContent={
                        <Trash2 absoluteStrokeWidth color="#f31260" />
                      }
                      radius="sm"
                      size="sm"
                      type="button"
                      variant="light"
                    />
                  </PopoverTrigger>
                  {popoverContent}
                </Popover>
              </div>
              <div className="text-lg font-bold">
                <p>Total price:</p>
                <span
                  className={`text-lg font-bold ${
                    discountedPrice ? 'text-primary-500' : 'text-foreground'
                  }`}
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
