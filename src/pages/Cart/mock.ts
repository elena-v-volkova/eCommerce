export const mockA = {
  id: '086f3383-9a86-4584-9b71-f81b5fcaa773',
  version: 30,
  productType: {
    typeId: 'product-type',
    id: '7fe4dfe2-427f-4b90-9b26-8eae6b417118',
  },
  name: {
    'en-US': '1990 Nissan 300ZX Turbo',
  },
  description: {
    'en-US':
      'The 1990 Nissan 300ZX Turbo is a technological marvel of the 1990s, blending style with performance. Its 3.0-liter twin-turbo V6 engine produces 300 horsepower, paired with a five-speed manual transmission for dynamic driving. This white example, with a black leather interior in excellent condition and 33,900 miles, is located in Tokyo, Japan. The 300ZX’s sleek design, pop-up headlights, and advanced suspension make it a collector’s favorite. Perfect for spirited drives, this Nissan is a 1990s icon of Japanese engineering.',
  },
  categories: [
    {
      typeId: 'category',
      id: '6d4963bf-5d97-4fdb-8046-f2508e0e88ce',
    },
    {
      typeId: 'category',
      id: '81443165-06a3-4f08-8b7f-40e3bec74b6f',
    },
    {
      typeId: 'category',
      id: 'd90de18f-77ad-41c1-9c2a-befe7aa177f5',
    },
  ],
  categoryOrderHints: {},
  slug: {
    'en-US': 'nissan-300zx-1990',
  },
  masterVariant: {
    id: 1,
    sku: 'NISSAN-1990-001',
    key: 'nissan-300zx-1990',
    prices: [
      {
        id: '5e9b6ad4-9349-4b90-9b4a-9587417c9bc7',
        value: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 5000000,
          fractionDigits: 2,
        },
        key: 'nissan-price-1',
        country: 'US',
        discounted: {
          value: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 4500000,
            fractionDigits: 2,
          },
          discount: {
            typeId: 'product-discount',
            id: 'f5cc8de5-ae25-4972-9283-b85af8da26bb',
          },
        },
      },
      {
        id: '44d7031e-a695-4ee6-9e82-c2092df675f3',
        value: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 4500000,
          fractionDigits: 2,
        },
        key: 'nissan-price-discount-1',
        country: 'US',
        validFrom: '2025-05-23T00:00:00.000Z',
        validUntil: '2025-06-23T23:59:59.000Z',
        discounted: {
          value: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 4050000,
            fractionDigits: 2,
          },
          discount: {
            typeId: 'product-discount',
            id: 'f5cc8de5-ae25-4972-9283-b85af8da26bb',
          },
        },
      },
    ],
    images: [
      {
        url: 'https://bringatrailer.com/wp-content/uploads/2020/02/1990_nissan_300zx_twin_turbo_158448004650ce740Nissan300ZX-2.jpg?fit=2000%2C1331',
        dimensions: {
          w: 2000,
          h: 1331,
        },
      },
      {
        url: 'https://bringatrailer.com/wp-content/uploads/2020/02/1990_nissan_300zx_twin_turbo_158448007111b920a492f3b2253eNissan300ZX-7.jpg?resize=620%2C413',
        dimensions: {
          w: 620,
          h: 413,
        },
      },
      {
        url: 'https://bringatrailer.com/wp-content/uploads/2020/02/1990_nissan_300zx_twin_turbo_15844800513b2253e7Nissan300ZX-3.jpg?resize=620%2C413',
        dimensions: {
          w: 620,
          h: 413,
        },
      },
      {
        url: 'https://bringatrailer.com/wp-content/uploads/2020/02/1990_nissan_300zx_twin_turbo_158448005650ce740Nissan300ZX-4.jpg?fit=2000%2C1331',
        dimensions: {
          w: 2000,
          h: 1331,
        },
      },
      {
        url: 'https://bringatrailer.com/wp-content/uploads/2020/02/1990_nissan_300zx_twin_turbo_1584480066a492f3b2253e7Nissan300ZX-6.jpg?fit=2000%2C1331',
        dimensions: {
          w: 2000,
          h: 1331,
        },
      },
    ],
    attributes: [
      {
        name: 'year-of-production',
        value: 1990,
      },
      {
        name: 'body-color',
        value: 'White',
      },
      {
        name: 'mileage',
        value: 33900,
      },
      {
        name: 'transmission',
        value: {
          key: 'manual',
          label: 'Manual',
        },
      },
      {
        name: 'seat-color',
        value: 'Black Leather',
      },
      {
        name: 'steering',
        value: {
          key: 'left-hand',
          label: 'Left-hand',
        },
      },
      {
        name: 'fuel-type',
        value: {
          key: 'petrol',
          label: 'Petrol',
        },
      },
      {
        name: 'location',
        value: 'Tokyo Japan',
      },
      {
        name: 'horsepower',
        value: 300,
      },
      {
        name: 'condition',
        value: {
          key: 'excellent',
          label: 'Excellent',
        },
      },
      {
        name: 'Brand',
        value: 'Nissan',
      },
    ],
    assets: [],
  },
  variants: [],
  searchKeywords: {},
  attributes: [],
  hasStagedChanges: false,
  published: true,
  key: 'nissan-300zx-1990',
  taxCategory: {
    typeId: 'tax-category',
    id: '3df94b9d-90e5-4044-89fd-2bd527933419',
  },
  createdAt: '2025-05-24T11:05:31.795Z',
  lastModifiedAt: '2025-06-09T11:22:00.366Z',
};

export const mockB = {
  id: 'b91d82b5-26dd-42e6-aa8e-7e5c0829662e',
  version: 29,
  productType: {
    typeId: 'product-type',
    id: '7fe4dfe2-427f-4b90-9b26-8eae6b417118',
  },
  name: {
    'en-US': '1984 Mercedes-Benz 500 SEC',
  },
  description: {
    'en-US':
      'The 1984 Mercedes-Benz 500 SEC is a luxurious coupe from the W126 series, combining elegance with performance. Its 5.0-liter V8 engine produces 245 horsepower, paired with a four-speed automatic transmission for smooth cruising. This silver example, with a grey leather interior in excellent condition and 42,300 miles, is located in Munich, Germany. The 500 SEC’s timeless design, with chrome accents and a pillarless roofline, exudes sophistication. Perfect for collectors, this Mercedes offers a refined driving experience with lasting appeal.',
  },
  categories: [
    {
      typeId: 'category',
      id: '81443165-06a3-4f08-8b7f-40e3bec74b6f',
    },
    {
      typeId: 'category',
      id: 'd90de18f-77ad-41c1-9c2a-befe7aa177f5',
    },
  ],
  categoryOrderHints: {},
  slug: {
    'en-US': 'mercedes-500sec-1984',
  },
  masterVariant: {
    id: 1,
    sku: 'MERCEDES-1984-001',
    key: 'mercedes-500sec-1984',
    prices: [
      {
        id: '667da484-b9bd-4628-8772-c23a3921c92c',
        value: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 4500000,
          fractionDigits: 2,
        },
        key: 'mercedes-price-1',
        country: 'US',
        discounted: {
          value: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 4050000,
            fractionDigits: 2,
          },
          discount: {
            typeId: 'product-discount',
            id: 'f5cc8de5-ae25-4972-9283-b85af8da26bb',
          },
        },
      },
      {
        id: 'c80b6a2a-3335-4804-81c1-89313c3c5d95',
        value: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 4050000,
          fractionDigits: 2,
        },
        key: 'mercedes-price-discount-1',
        country: 'US',
        validFrom: '2025-05-23T00:00:00.000Z',
        validUntil: '2025-06-23T23:59:59.000Z',
        discounted: {
          value: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 3645000,
            fractionDigits: 2,
          },
          discount: {
            typeId: 'product-discount',
            id: 'f5cc8de5-ae25-4972-9283-b85af8da26bb',
          },
        },
      },
    ],
    images: [
      {
        url: 'https://www.mercedes-fans.de/thumbs/img/News/34/84/01/p/p_full_b/silver-star-84er-mercedes-benz-300d-w123-im-milden-sporttrimm-18434.jpg',
        dimensions: {
          w: 1280,
          h: 582,
        },
      },
      {
        url: 'https://www.mercedes-fans.de/thumbs/lib/40/10/11/i_full_b/111040.jpg',
        dimensions: {
          w: 1280,
          h: 853,
        },
      },
      {
        url: 'https://www.mercedes-fans.de/thumbs/lib/41/10/11/i_full_b/111041.jpg',
        dimensions: {
          w: 1280,
          h: 853,
        },
      },
      {
        url: 'https://www.mercedes-fans.de/thumbs/lib/47/10/11/i_full_b/111047.jpg',
        dimensions: {
          w: 1280,
          h: 853,
        },
      },
      {
        url: 'https://www.mercedes-fans.de/thumbs/lib/38/10/11/i_full_b/111038.jpg',
        dimensions: {
          w: 1280,
          h: 853,
        },
      },
    ],
    attributes: [
      {
        name: 'year-of-production',
        value: 1984,
      },
      {
        name: 'body-color',
        value: 'Silver',
      },
      {
        name: 'mileage',
        value: 42300,
      },
      {
        name: 'transmission',
        value: {
          key: 'automatic',
          label: 'Automatic',
        },
      },
      {
        name: 'seat-color',
        value: 'Grey Leather',
      },
      {
        name: 'steering',
        value: {
          key: 'left-hand',
          label: 'Left-hand',
        },
      },
      {
        name: 'fuel-type',
        value: {
          key: 'petrol',
          label: 'Petrol',
        },
      },
      {
        name: 'location',
        value: 'Munich Germany',
      },
      {
        name: 'horsepower',
        value: 245,
      },
      {
        name: 'condition',
        value: {
          key: 'excellent',
          label: 'Excellent',
        },
      },
      {
        name: 'Brand',
        value: 'Mercedes-Benz',
      },
    ],
    assets: [],
  },
  variants: [],
  searchKeywords: {},
  attributes: [],
  hasStagedChanges: false,
  published: true,
  key: 'mercedes-500sec-1984',
  taxCategory: {
    typeId: 'tax-category',
    id: '3df94b9d-90e5-4044-89fd-2bd527933419',
  },
  createdAt: '2025-05-24T11:05:31.801Z',
  lastModifiedAt: '2025-06-09T11:21:25.452Z',
};
