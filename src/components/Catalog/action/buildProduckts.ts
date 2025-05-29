import { Product } from '@commercetools/platform-sdk';

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

const getAttributeValue = (attributes: any[], attributeName: string): any => {
  const attribute = attributes?.find((attr) => attr.name === attributeName);

  if (!attribute) return null;

  // Если value это объект с key и label, возвращаем key
  if (typeof attribute.value === 'object' && attribute.value.key) {
    return attribute.value.key;
  }

  return attribute.value;
};

const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const transformProductToSchemaShape = (
  product: Product,
): ProductsSimpleNew => {
  const current = product.masterData.current;
  const prices = current.masterVariant.prices ?? [];
  const attributes = current.masterVariant.attributes ?? [];

  const currentPriceCents = prices[0]?.value.centAmount ?? 0;
  const price = currentPriceCents ? currentPriceCents / 100 : 0;

  const originalPrice = Math.round(price * 1.1);

  const discount =
    price > 0 && originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const brand = getAttributeValue(attributes, 'Brand') || 'Unknown';
  const year =
    getAttributeValue(attributes, 'year-of-production') ||
    new Date().getFullYear();
  const bodyColor = getAttributeValue(attributes, 'body-color') || 'Unknown';
  const mileage =
    Math.round(getAttributeValue(attributes, 'mileage') * 1000) || 0; // Конвертируем в км если нужно
  const transmission =
    getAttributeValue(attributes, 'transmission') || 'manual';
  const fuelType = getAttributeValue(attributes, 'fuel-type') || 'petrol';
  const location = getAttributeValue(attributes, 'location') || 'Unknown';
  const horsepower = getAttributeValue(attributes, 'horsepower') || 0;
  const condition = getAttributeValue(attributes, 'condition') || 'good';

  // Изображения - извлекаем URL из структуры commercetools
  const images = current.masterVariant.images?.map((img) => img.url) ?? [];

  // Категории - извлекаем ID категорий
  const categories = current.categories?.map((cat) => cat.id) ?? [];

  // Название и описание - используем en-US локализацию
  const name =
    current.name?.['en-US'] ||
    current.name?.en ||
    Object.values(current.name || {})[0] ||
    'Untitled Product';
  const description =
    current.description?.['en-US'] ||
    current.description?.en ||
    Object.values(current.description || {})[0] ||
    '';

  // Slug уже есть в данных
  const slug =
    current.slug?.['en-US'] ||
    current.slug?.en ||
    Object.values(current.slug || {})[0] ||
    createSlug(name);

  return {
    id: product.key || product.id,
    name,
    slug,
    description,
    brand,
    year,
    price,
    originalPrice,
    discount,
    images,
    bodyColor,
    mileage,
    transmission,
    fuelType,
    location,
    horsepower,
    condition,
    categories,
  };
};

// Трансформация массива продуктов
export const transformProductsToSchemaShapeNew = (
  products: Product[],
): ProductsSimpleNew[] => {
  return products.map(transformProductToSchemaShape);
};
