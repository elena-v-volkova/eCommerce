import { Cart, DiscountCode } from '@commercetools/platform-sdk';
import { Divider } from '@heroui/react';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

import { formatPrice } from '@/shared/utils/utils';

export type MyDiscount = {
  amount: string;
  id: string;
};

type DiscountAmountProps = {
  cart: Cart;
  cartDiscountByID: (discountId: string) => Promise<DiscountCode | void>;
  cancelDiscountById: (discountId: string) => Promise<Cart | void>;
};

export function DiscountAmount({
  cart,
  cartDiscountByID,
  cancelDiscountById,
}: DiscountAmountProps) {
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

  if (cart.discountOnTotalPrice)
    return (
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
          <div key={key} className="flex items-stretch justify-between text-sm">
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
    );
}
