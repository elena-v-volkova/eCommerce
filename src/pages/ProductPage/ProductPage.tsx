// ProductPage.tsx

import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';

import { Card, CardBody, CardHeader, Chip, Spinner } from '@heroui/react';

import { apiAnonRoot } from '@/commercetools/anonUser';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

interface ProductProjection {
  id: string;
  name?: Record<string, string>;
  slug?: Record<string, string>;
  description?: Record<string, string>;
  masterVariant: any;
}

export default function ProductPage() {
  const { key } = useParams() as { key: string };
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductProjection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    apiAnonRoot
      .productProjections()
      .withKey({ key })
      .get({ queryArgs: { staged: false } })
      .execute()
      .then((res) => {
        if (!isMounted) return;
        if (res.statusCode !== 200) throw new Error('Not found');
        setProduct(res.body);
      })
      .catch(() => navigate('/404'))
      .finally(() => isMounted && setLoading(false));

    return () => {
      isMounted = false;
    };
  }, [key, navigate]);

  const LOCALE = 'en-US';
  const CURRENCY = 'USD';
  const variant = product?.masterVariant;

  const price = useMemo(() => {
    if (!variant) return null;
    const p = variant.prices?.find(
      (pr: any) => pr.value.currencyCode === CURRENCY,
    );
    return p
      ? (p.value.centAmount / 100).toLocaleString(undefined, {
          style: 'currency',
          currency: CURRENCY,
        })
      : null;
  }, [variant, CURRENCY]);

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product || !variant) return null;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <RouterLink to="/" className="text-sm text-gray-500 hover:underline">
        &larr; Back
      </RouterLink>

      <Card shadow="lg" radius="lg" className="overflow-hidden">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={10}
              slidesPerView={1}
              loop
              className="h-full"
            >
              {variant.images?.map((img: any) => (
                <SwiperSlide key={img.url}>
                  <div className="flex items-center justify-center h-full">
                    <img
                      src={img.url}
                      alt={product.name?.[LOCALE] ?? 'Product image'}
                      className="rounded-2xl"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="space-y-6 p-6">
            <CardHeader className="p-0">
              <h1 className="text-3xl font-bold">
                {product.name?.[LOCALE] ?? 'Untitled product'}
              </h1>
            </CardHeader>

            {price && <p className="text-2xl font-semibold">{price}</p>}

            {product.description?.[LOCALE] && (
              <CardBody className="p-0">
                <p className="text-base leading-relaxed">
                  {product.description[LOCALE]}
                </p>
              </CardBody>
            )}

            {variant.attributes?.length && (
              <div>
                <h2 className="font-medium mb-3">Specifications</h2>
                <div className="flex flex-wrap gap-2">
                  {variant.attributes.map((attr: any) => (
                    <Chip key={attr.name} variant="bordered" color="primary">
                      <span className="mr-1 text-gray-500 text-xs">
                        {attr.name}:
                      </span>
                      {typeof attr.value === 'object'
                        ? (attr.value.label ?? attr.value.key)
                        : attr.value?.toString()}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
