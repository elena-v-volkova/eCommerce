import { useEffect, useState } from 'react';

import { buildCategoryTree, CategoryNode } from '../action/categoryBuilder';

import { apiAnonRoot } from '@/commercetools/anonUser';

const useCategoryList = () => {
  const [categoryList, setCategoryList] = useState<CategoryNode[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    async function getCategories() {
      try {
        const response = await apiAnonRoot.categories().get().execute();
        const categories = response.body.results;

        setCategoryList(buildCategoryTree(categories));
      } catch (err: unknown) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    getCategories();
  }, []);

  return {
    categoryList,
    isLoading,
    error,
  };
};

export default useCategoryList;
