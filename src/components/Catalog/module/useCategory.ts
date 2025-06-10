import { useEffect, useState } from 'react';

import { apiAnonRoot } from '@/commercetools/anonUser';

type FlatCategory = {
  id: string;
  key: string | undefined;
  name: string;
  description: string;
  parent: string | null;
};

export const useRetroCarCategories = () => {
  const [categories, setCategories] = useState<FlatCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiAnonRoot
          .categories()
          .get({ queryArgs: { limit: 500 } })
          .execute();

        const allCategories = response.body.results;

        const idToCategory = new Map<string, FlatCategory>();

        for (const cat of allCategories) {
          idToCategory.set(cat.id, {
            id: cat.id,
            key: cat.key,
            name: cat.name['en'] || Object.values(cat.name)[0],
            description: cat.description?.['en'] || '',
            parent: cat.parent?.id || null,
          });
        }

        const retroCategoryEntry = Array.from(idToCategory.entries()).find(
          ([, cat]) => cat.key === 'retro-cars',
        );

        if (!retroCategoryEntry) {
          setCategories([]);

          return;
        }

        const retroRootId = retroCategoryEntry[0];
        const result: FlatCategory[] = [];

        const collectSubtree = (parentId: string | null) => {
          for (const [id, cat] of idToCategory.entries()) {
            if (cat.parent === parentId) {
              const parentKey = parentId
                ? idToCategory.get(parentId)?.key || null
                : null;

              result.push({ ...cat, parent: parentKey });
              collectSubtree(id);
            }
          }
        };

        result.push({
          id: retroRootId,
          key: 'retro-cars',
          name: idToCategory.get(retroRootId)?.name || 'Retro Cars',
          description: idToCategory.get(retroRootId)?.description || '',
          parent: null,
        });

        collectSubtree(retroRootId);

        setCategories(result);
      } catch (err) {
        setError(err);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return {
    categories,
    isLoading,
    error,
  };
};
