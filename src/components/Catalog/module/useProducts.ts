import { useEffect, useState } from 'react';

import {
  ProductsSimpleNew,
  transformProductsToSchemaShapeNew,
} from '../action/buildProduckts';

import { apiAnonRoot } from '@/commercetools/anonUser';

export const useProductsNew = () => {
  const [products, setProducts] = useState<ProductsSimpleNew[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await apiAnonRoot.products().get().execute();

        setProducts(transformProductsToSchemaShapeNew(response.body.results));
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    getProducts();
  }, []);

  return { products, isLoading, error };
};
