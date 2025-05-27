import { Button, Card, CardBody, CardHeader, Image } from '@heroui/react';
import { ShoppingCart } from 'lucide-react';

import { HeartIcon } from '@/shared/assets/svg/HeartIcon';
import { ProductsSimple } from '../lib/productSchema';

interface IProductProps {
  product: ProductsSimple;
}

const CardItem = ({ product }: IProductProps) => {
  return (
    <Card
      isPressable
      className="group overflow-hidden shadow-lg transition-shadow duration-300 hover:cursor-pointer hover:shadow-xl flex flex-col min-[900px]:flex-row"
      onPress={() => console.log('Card pressed')}
    >
      {/* Изображение */}
      <div className="relative w-full h-48 min-[900px]:h-full min-[900px]:flex-1 overflow-hidden rounded-t-xl min-[900px]:rounded-l-xl min-[900px]:rounded-tr-none">
        <Image
          isZoomed
          alt="Card background"
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-125"
          src={product.images?.[0]?.url ?? '/placeholder-image.jpg'}
        />
        <Button
          isIconOnly
          aria-label="Like"
          className="absolute right-3 top-3 z-10 bg-white/30 backdrop-blur-sm transition-colors hover:bg-danger/80"
          color="danger"
          radius="full"
          size="sm"
        >
          <HeartIcon className="size-4" />
        </Button>
      </div>

      {/* Контент — снизу на мобильных, справа на десктопах */}
      <CardBody className="relative overflow-visible p-0 sm:flex-1">
        <div className="px-4 py-3">
          <CardHeader className="flex-col items-start p-0">
            <p className="text-tiny font-bold uppercase text-default-600">
              {product.name['en-US'] ?? 'no name'}
            </p>
            <small className="text-default-500 line-clamp-3">
              {product.description['en-US'] ?? 'no desc'}
            </small>
            <div className="mt-1 flex items-center gap-2">
              <h4 className="text-large font-bold text-red-500">
                {product.prices?.[1]?.value.centAmount ?? 'Цена отсутствует'}
              </h4>
              <span className="text-small text-default-400 line-through">
                {product.prices?.[0]?.value.centAmount ?? ''}
              </span>
              <span className="ml-1 rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-600">
                Save $5.00
              </span>
            </div>
          </CardHeader>

          <div className="mt-3 flex items-center justify-between">
            <Button
              className="font-medium"
              color="primary"
              endContent={<ShoppingCart className="size-4" />}
              size="sm"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CardItem;
