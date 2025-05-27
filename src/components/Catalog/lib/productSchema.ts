import { Product } from '@commercetools/platform-sdk';
import { z } from 'zod';

const localizedStringSchema = z.record(z.string());

const imageSchema = z.object({
  url: z.string().url(),
  label: z.string().optional(),
});

const priceSchema = z.object({
  value: z.object({
    currencyCode: z.string(),
    centAmount: z.number(),
  }),
  country: z.string().optional(),
});

const attributeSchema = z.object({
  name: z.string(),
  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z
      .object({
        label: z.string(),
      })
      .passthrough(),
  ]),
});

const productSchema = z.object({
  id: z.string(),
  key: z.string().optional(),
  createdAt: z.string().datetime(),
  description: localizedStringSchema.optional(),
  name: localizedStringSchema,
  attributes: z.array(attributeSchema).optional(),
  images: z.array(imageSchema).optional(),
  prices: z.array(priceSchema).optional(),
});

export type ProductsSimple = z.infer<typeof productSchema>;

export const transformProductToSchemaShape = (
  product: Product,
): ProductsSimple => {
  const current = product.masterData.current;

  return {
    id: product.id,
    key: product.key,
    createdAt: product.createdAt,
    description: current.description,
    name: current.name,
    attributes: current.masterVariant.attributes ?? [],
    images: current.masterVariant.images ?? [],
    prices: current.masterVariant.prices ?? [],
  };
};

export const transformProductsToSchemaShape = (
  products: Product[],
): ProductsSimple[] => {
  return products.map(transformProductToSchemaShape);
};
