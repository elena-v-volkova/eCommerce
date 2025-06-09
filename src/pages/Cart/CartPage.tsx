import { Button } from '@heroui/button';
import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router';

import { AppRoute } from '@/routes/appRoutes';
import { tokenCache } from '@/commercetools/login';

export function CartPage() {
  return <EmptyCart />;
}

function EmptyCart() {
  const hasToken = Object.keys(tokenCache.get()).length > 0;
  const navigate = useNavigate();

  return (
    <div className="flex w-full flex-col    items-center justify-center">
      <ShoppingBag color="#d1d1d1" size={120} />
      <p className=" text-large font-semibold leading-9 text-gray-400 lg:text-5xl">
        Don`t have any items in cart.
      </p>
      {!hasToken && (
        <p className="font-semibold text-gray-700 lg:text-xl">
          Have an account? Sign in to see your items.
        </p>
      )}
      <div
        className={`mt-[30px] flex w-full max-w-[400px] ${
          hasToken ? 'justify-center' : 'justify-between'
        } gap-4`}
      >
        <Button
          className="w-[200px] font-bold  uppercase"
          color="secondary"
          radius="full"
          variant="ghost"
          onClick={() => navigate(`/${AppRoute.catalog}`)}
        >
          catalog page
        </Button>
        {!hasToken && (
          <Button
            className="w-[200px] font-bold uppercase"
            color="primary"
            radius="full"
            variant="light"
            onClick={() => navigate(`/${AppRoute.login}`, { replace: false })}
          >
            Sign in
          </Button>
        )}
      </div>
    </div>
  );
}
