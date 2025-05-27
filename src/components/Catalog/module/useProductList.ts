import { useEffect, useState } from 'react';

import { apiAnonRoot } from '@/commercetools/anonUser';
import {
  ProductsSimple,
  transformProductsToSchemaShape,
} from '../lib/productSchema';

export const useProducts = () => {
  const [products, setProducts] = useState<ProductsSimple[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await apiAnonRoot.products().get().execute();

        setProducts(transformProductsToSchemaShape(response.body.results));
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
