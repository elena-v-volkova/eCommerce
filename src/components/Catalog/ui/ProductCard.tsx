import { useState } from 'react';

import { MapPin, Gauge, Car, ShoppingCart, Trash2 } from 'lucide-react';

import { Card, CardBody, Image, Chip, Button } from '@heroui/react';
import { Cart } from '@commercetools/platform-sdk';

import { ProductsSimpleNew } from '../module/useProductSearch';

import { formatPrice } from '@/shared/utils/utils';

interface IProductCard {
  product: ProductsSimpleNew;
  onClick: (product: ProductsSimpleNew) => void;
  cart: Cart | null;

  addItem: (productId: string, variantId?: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  isLoading: boolean;
}

const ProductCard = ({
  product,
  onClick,
  cart,
  addItem,
  removeItem,
  isLoading,
}: IProductCard) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isInCart = cart?.lineItems?.some(
    (item) => item.productId === product.id,
  );

  const lineItem = cart?.lineItems?.find(
    (item) => item.productId === product.id,
  );

  return (
    <Card
      as="div"
      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
        isHovered ? 'ring-2 ring-primary' : ''
      }`}
      isPressable={true}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPress={() => onClick(product)}
    >
      <CardBody className="p-0">
        <div className="relative overflow-hidden">
          <Image
            removeWrapper
            alt={product.name}
            className={`h-48 w-full object-cover transition-transform duration-300 ${
              isHovered ? 'scale-110' : ''
            }`}
            src={
              imageError
                ? 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400'
                : product.images[0]
            }
            onError={() => setImageError(true)}
          />

          {/* Discount Badge */}
          {product.discount && (
            <Chip
              className="absolute left-2 top-2 z-30"
              color="danger"
              size="sm"
              variant="solid"
            >
              -{product.discount}%
            </Chip>
          )}

          {/* Condition Badge */}
          <Chip
            className="absolute right-2 top-2 z-30 bg-black/50 capitalize text-white"
            color="default"
            size="sm"
            variant="solid"
          >
            {product.condition}
          </Chip>
        </div>

        <div className="p-4">
          {/* Brand and Year */}
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm text-foreground-500">{product.brand}</span>
            <span className="text-sm text-foreground-400">•</span>
            <span className="text-sm text-foreground-500">{product.year}</span>
          </div>

          {/* Title */}
          <h3 className="mb-2 line-clamp-1 text-lg font-bold text-foreground">
            {product.name}
          </h3>

          {/* Description */}
          <p className="mb-3 line-clamp-2 text-sm text-foreground-600">
            {product.description}
          </p>

          {/* Car Details */}
          <div className="mb-3 flex items-center gap-4 text-xs text-foreground-500">
            <div className="flex items-center gap-1">
              <Gauge className="size-3" />
              <span>{(product.mileage / 1000)?.toLocaleString()}k mi</span>
            </div>
            <div className="flex items-center gap-1">
              <Car className="size-3" />
              <span>{product.horsepower} HP</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="size-3" />
              <span className="truncate">{product.location}</span>
            </div>
          </div>

          {/* Price and Rating */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {product.originalPrice && (
                <span className="text-sm text-foreground-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span
                className={`text-lg font-bold ${
                  product.discount ? 'text-danger' : 'text-foreground'
                }`}
              >
                {formatPrice(product.price)}
              </span>
            </div>

            <Button
              className="flex items-center gap-1"
              color={!isInCart ? 'primary' : 'danger'}
              isLoading={isLoading}
              onPress={() => {
                if (!isInCart) {
                  addItem(product.id, product.variantId);
                } else if (lineItem) {
                  removeItem(lineItem.id);
                }
              }}
            >
              {!isInCart ? (
                <ShoppingCart className="size-6 text-warning" />
              ) : (
                <Trash2 className="size-6 text-warning" />
              )}
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ProductCard;
