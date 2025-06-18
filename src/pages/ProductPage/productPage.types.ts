export type AttributeValue =
  | string
  | number
  | {
      key: string;
      label: string;
    };

export interface Attribute {
  name: string;
  value: AttributeValue;
}

export interface Price {
  id: string;
  value: {
    type: string;
    currencyCode: string;
    centAmount: number;
    fractionDigits: number;
  };
  validFrom?: string;
  validUntil?: string;
  discounted?: number;
}

export interface Variant {
  images?: { url: string; dimensions?: { w: number; h: number } }[];
  prices?: Price[];
  attributes?: Attribute[];
}

export interface ProductProjection {
  id: string;
  name?: Record<string, string>;
  slug?: Record<string, string>;
  description?: Record<string, string>;
  masterVariant: Variant;
}
