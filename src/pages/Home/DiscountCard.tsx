import { Card, Snippet } from '@heroui/react';
import {
  DiscountCode,
  DiscountCodePagedQueryResponse,
  LocalizedString,
} from '@commercetools/platform-sdk';

export function Discounts({ data }: { data: DiscountCodePagedQueryResponse }) {
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <p className="text-[1.3rem] capitalize text-slate-600">
        discount coupons
      </p>
      <div className="flex w-full flex-wrap justify-center gap-2 ">
        {data.results.map((item: DiscountCode) => (
          <DiscountCard key={item.id} {...formatInfo(item)} />
        ))}
      </div>
    </div>
  );
}

function formatInfo(item: DiscountCode): DiscountProps {
  return {
    discountPercent: item.cartDiscounts[0].obj?.name || 0,
    code: item.code,
    description: item.description || {},
    color: 'primary',
  };
}

interface DiscountProps {
  discountPercent: number | LocalizedString;
  code: string;
  description: LocalizedString;
  color:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | undefined;
}

function DiscountCard(prop: DiscountProps) {
  const persent = prop.description.ru.substring(prop.description.ru.length - 3);

  return (
    <Card
      className="w-[345px] bg-background/60 p-6 text-slate-400 dark:bg-default-100/50"
      shadow="sm"
    >
      <div className="flex items-start justify-between text-2xl font-extrabold">
        {persent} OFF
      </div>
      <div className="mb-4 mt-1">
        <div className="mt-1 flex items-center gap-2">
          <Snippet
            className="w-full rounded-lg bg-white/10 px-4 py-2 font-mono text-2xl font-bold tracking-wider text-slate-400"
            size="lg"
            symbol=""
            variant="bordered"
          >
            {prop.code}
          </Snippet>
        </div>
      </div>
      <p className="opacity-90">{`${prop.description['en-US']}`}</p>
    </Card>
  );
}
