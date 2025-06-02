import { useState, useEffect, useCallback } from 'react';
import {
  ProductProjection,
  ProductProjectionPagedSearchResponse,
  Attribute,
  ClientResponse,
} from '@commercetools/platform-sdk';

import { apiAnonRoot } from '@/commercetools/anonUser';

// Interfaces

interface QueryArgs {
  limit: number;
  offset: number;
  staged: boolean;
  'text.en-US'?: string;
  fuzzy?: boolean;
  fuzzyLevel?: number;
  filter?: string[];
  sort?: string;
  [key: string]: string | number | boolean | string[] | undefined;
}

interface SearchParams {
  query?: string;
  categoryId?: string;
  priceRange?: [number, number];
  brands?: string[];
  years?: [number, number];
  transmission?: string;
  condition?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface ProductsSimpleNew {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  year: number;
  price: number;
  originalPrice: number;
  discount: number;
  images: string[];
  bodyColor: string;
  mileage: number;
  transmission: string;
  fuelType: string;
  location: string;
  horsepower: number;
  condition: string;
  categories: string[];
}

interface SearchResult {
  products: ProductsSimpleNew[];
  total: number;
  isLoading: boolean;
  error: string | null;
}

interface FilterOptions {
  brands: string[];
  conditions: string[];
  transmissions: string[];
}

// API Service
const productSearchService = {
  async searchProducts(params: SearchParams): Promise<{
    products: ProductsSimpleNew[];
    total: number;
  }> {
    const queryArgs = buildQueryArgs(params);

    try {
      const response: ClientResponse<ProductProjectionPagedSearchResponse> =
        await apiAnonRoot
          .productProjections()
          .search()
          .get({ queryArgs })
          .execute();

      return {
        products: transformProducts(response.body.results),
        total: response.body.total || response.body.results.length,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to search products',
      );
    }
  },

  async getFilterOptions(): Promise<FilterOptions> {
    try {
      const response: ClientResponse<ProductProjectionPagedSearchResponse> =
        await apiAnonRoot
          .productProjections()
          .search()
          .get({ queryArgs: { limit: 500, staged: false } })
          .execute();

      return extractFilterOptions(response.body.results);
    } catch {
      return { brands: [], conditions: [], transmissions: [] };
    }
  },
};

// Helper Functions
const buildQueryArgs = (params: SearchParams): QueryArgs => {
  const queryArgs: QueryArgs = {
    limit: params.limit || 20,
    offset: params.offset || 0,
    staged: false,
  };

  // Text search
  if (params.query?.trim()) {
    queryArgs['text.en-US'] = params.query.trim();
    queryArgs.fuzzy = true;
    queryArgs.fuzzyLevel = params.query.length <= 2 ? 0 : 1;
  }

  // Filters
  const filters: string[] = [];

  if (params.categoryId) {
    filters.push(`categories.id:"${params.categoryId}"`);
  }
  if (
    params.priceRange &&
    (params.priceRange[0] > 0 || params.priceRange[1] < 500000)
  ) {
    const [minPrice, maxPrice] = params.priceRange;

    filters.push(
      `variants.price.centAmount:range(${minPrice * 100} to ${maxPrice * 100})`,
    );
  }
  if (params.brands?.length) {
    filters.push(
      `variants.attributes.Brand:${params.brands.map((b) => `"${b}"`).join(',')}`,
    );
  }
  if (params.years && (params.years[0] > 1950 || params.years[1] < 2000)) {
    filters.push(
      `variants.attributes.year-of-production:range(${params.years[0]} to ${params.years[1]})`,
    );
  }
  if (params.transmission) {
    filters.push(
      `variants.attributes.transmission.key:"${params.transmission}"`,
    );
  }
  if (params.condition) {
    filters.push(`variants.attributes.condition.key:"${params.condition}"`);
  }
  if (filters.length) {
    queryArgs.filter = filters;
  }

  // Sorting
  if (params.sortBy) {
    const direction = params.sortOrder === 'desc' ? 'desc' : 'asc';

    queryArgs.sort = getSortExpression(params.sortBy, direction);
  }

  return queryArgs;
};

const getSortExpression = (sortBy: string, direction: string): string => {
  switch (sortBy) {
    case 'price':
      return `price ${direction}`;
    case 'year':
      return `variants.attributes.year-of-production ${direction}`;
    default:
      return `name.en-US ${direction}`;
  }
};

const transformProducts = (
  products: ProductProjection[],
): ProductsSimpleNew[] => {
  return products.map((product) => {
    const attributes: Attribute[] = product.masterVariant.attributes || [];
    const getAttributeValue = (name: string): string => {
      const attr = attributes.find((a) => a.name === name);

      if (!attr) return '';

      return typeof attr.value === 'object' &&
        attr.value !== null &&
        'key' in attr.value
        ? (attr.value as { key: string }).key
        : String(attr.value || '');
    };

    const prices = product.masterVariant.prices?.[0];
    const price = prices?.discounted?.value?.centAmount;
    const originalPrice = prices?.value?.centAmount;

    const discount =
      typeof price === 'number' &&
      typeof originalPrice === 'number' &&
      price > 0 &&
      originalPrice > 0
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    return {
      id: product.id,
      name:
        product.name['en-US'] ||
        product.name.en ||
        Object.values(product.name)[0] ||
        '',
      slug:
        product.slug['en-US'] ||
        product.slug.en ||
        Object.values(product.slug)[0] ||
        '',
      description:
        product.description?.['en-US'] ||
        product.description?.en ||
        Object.values(product.description || {})[0] ||
        '',
      price: product.masterVariant.prices?.[0].discounted?.value.centAmount,
      originalPrice: product.masterVariant.prices?.[0].value.centAmount,
      discount,
      images: product.masterVariant.images?.map((img) => img.url) || [],
      brand:
        getAttributeValue('Brand') || getAttributeValue('brand') || 'Unknown',
      year:
        Number(
          getAttributeValue('year-of-production') || getAttributeValue('year'),
        ) || new Date().getFullYear(),
      transmission: getAttributeValue('transmission') || 'manual',
      condition: getAttributeValue('condition') || 'good',
      bodyColor: getAttributeValue('body-color') || 'Unknown',
      mileage: Number(getAttributeValue('mileage')) || 0,
      fuelType: getAttributeValue('fuel-type') || 'petrol',
      location: getAttributeValue('location') || 'Unknown',
      horsepower: Number(getAttributeValue('horsepower')) || 0,
      categories: product.categories.map((cat) => cat.id),
    } as ProductsSimpleNew;
  });
};

const extractFilterOptions = (products: ProductProjection[]): FilterOptions => {
  const brands = new Set<string>();
  const conditions = new Set<string>();
  const transmissions = new Set<string>();

  products.forEach((product) => {
    const attributes: Attribute[] = product.masterVariant.attributes || [];
    const getAttributeValue = (name: string): string => {
      const attr = attributes.find((a) => a.name === name);

      if (!attr) return '';

      return typeof attr.value === 'object' &&
        attr.value !== null &&
        'key' in attr.value
        ? (attr.value as { key: string }).key
        : String(attr.value || '');
    };

    const brand = getAttributeValue('Brand');
    const condition = getAttributeValue('condition');
    const transmission = getAttributeValue('transmission');

    if (brand) brands.add(brand);
    if (condition) conditions.add(condition);
    if (transmission) transmissions.add(transmission);
  });

  return {
    brands: Array.from(brands).sort(),
    conditions: Array.from(conditions).sort(),
    transmissions: Array.from(transmissions).sort(),
  };
};

// Custom Hook
export const useProductSearch = () => {
  const [searchResult, setSearchResult] = useState<SearchResult>({
    products: [],
    total: 0,
    isLoading: false,
    error: null,
  });

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    brands: [],
    conditions: [],
    transmissions: [],
  });

  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  const loadFilterOptions = useCallback(async () => {
    const options = await productSearchService.getFilterOptions();

    setFilterOptions(options);
  }, []);

  const searchProducts = useCallback(async (params: SearchParams) => {
    setSearchResult((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const { products, total } =
        await productSearchService.searchProducts(params);

      setSearchResult({ products, total, isLoading: false, error: null });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Search failed';

      setSearchResult((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, []);

  const debouncedSearch = useCallback(
    (params: SearchParams, delay: number = 300) => {
      if (searchTimeout) clearTimeout(searchTimeout);
      const timeout = setTimeout(() => searchProducts(params), delay);

      setSearchTimeout(timeout);
    },
    [searchTimeout],
  );

  const immediateSearch = useCallback(
    (params: SearchParams) => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
        setSearchTimeout(null);
      }
      searchProducts(params);
    },
    [searchTimeout, searchProducts],
  );

  useEffect(() => {
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [searchTimeout]);

  return {
    ...searchResult,
    filterOptions,
    loadFilterOptions,
    searchProducts: debouncedSearch,
    immediateSearch,
  };
};
