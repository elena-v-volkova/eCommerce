import { useEffect, useState } from 'react';

import CardItem from '../../Card/Card';

import { apiAnonRoot } from '@/commercetools/anonUser';
import { useProducts } from '../../module/useProductList';
import { SkeletonSidebar } from '../SkeletonSidebar';

export const ProductList = () => {
  const { products, isLoading } = useProducts();

  if (isLoading) {
    return <SkeletonSidebar />;
  }

  return (
    <div className="flex flex-wrap">
      {products.length > 0 &&
        products?.map((product) => (
          <div key={product.key} className="mb-4">
            <CardItem product={product} />
          </div>
        ))}
    </div>
  );
};
