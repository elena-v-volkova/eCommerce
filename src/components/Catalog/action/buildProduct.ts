// import { getDiscount } from '@/shared/api/api';

// export interface ProductsSimpleNew {
//   id: string;
//   name: string;
//   slug: string;
//   description: string;
//   brand: string;
//   year: number;
//   price: number;
//   originalPrice: number;
//   discount: number;
//   images: string[];
//   bodyColor: string;
//   mileage: number;
//   transmission: string;
//   fuelType: string;
//   location: string;
//   horsepower: number;
//   condition: string;
//   categories: string[];
// }

// const buildProducts = async (product) => {
//   const attributes = product.masterVariant.attributes || [];

//   // Fixed getAttributeValue function to handle {key, label} objects
//   const getAttributeValue = (name: string) => {
//     const attr = attributes.find((a) => a.name === name);

//     if (!attr) return '';

//     // If value is an object with key and label, return the key
//     if (
//       typeof attr.value === 'object' &&
//       attr.value !== null &&
//       'key' in attr.value
//     ) {
//       return attr.value.key;
//     }

//     return attr.value || '';
//   };

//   // Получаем цену
//   const price = product.masterVariant.prices?.[0]?.value.centAmount
//     ? product.masterVariant.prices[0].value.centAmount / 100
//     : 0;

//   // Получаем изображения
//   const images = product.masterVariant.images?.map((img) => img.url) || [];

//   // Calculate original price and discount
//   const originalPrice = Math.round(price * 1.1);
//   const discount = await getDiscount();

//   return {
//     id: product.id,
//     name: product.name.en || product.name[Object.keys(product.name)[0]] || '',
//     slug: product.slug.en || product.slug[Object.keys(product.slug)[0]] || '',
//     description:
//       product.description?.en ||
//       product.description?.[Object.keys(product.description || {})[0]] ||
//       '',
//     price,
//     originalPrice,
//     discount: discount[0],
//     images,
//     brand:
//       getAttributeValue('Brand') || getAttributeValue('brand') || 'Unknown',
//     year:
//       Number(
//         getAttributeValue('year-of-production') || getAttributeValue('year'),
//       ) || new Date().getFullYear(),
//     transmission: getAttributeValue('transmission') || 'manual',
//     condition: getAttributeValue('condition') || 'good',
//     bodyColor: getAttributeValue('body-color') || 'Unknown',
//     mileage: Math.round(Number(getAttributeValue('mileage')) * 1000) || 0,
//     fuelType: getAttributeValue('fuel-type') || 'petrol',
//     location: getAttributeValue('location') || 'Unknown',
//     horsepower: Number(getAttributeValue('horsepower')) || 0,
//     categories: product.categories.map((cat) => cat.id),
//   } as ProductsSimpleNew;
// };

// export default buildProducts;
