// ProductPage.tsx

import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo, useRef } from 'react';
import { Card, CardBody, CardHeader, Chip, Spinner } from '@heroui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import { apiAnonRoot } from '@/commercetools/anonUser';

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
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const mainSwiperRef = useRef<any>(null);

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
      <div className="mt-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product || !variant) return null;

  const closeFullscreen = () => setOpenIndex(null);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <RouterLink className="text-sm text-gray-500 hover:underline" to="/">
        &larr; Back
      </RouterLink>

      <Card className="overflow-hidden" radius="lg" shadow="lg">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4">
            <Swiper
              loop
              navigation
              className="h-full"
              modules={[Navigation, Pagination]}
              pagination={{ clickable: true }}
              slidesPerView={1}
              spaceBetween={10}
              onSwiper={(swiper) => {
                mainSwiperRef.current = swiper;
              }}
            >
              {variant.images?.map((img: any, idx: number) => (
                <SwiperSlide key={img.url}>
                  <div className="flex h-full items-center justify-center">
                    <button
                      className="max-h-full max-w-full cursor-pointer overflow-hidden rounded-2xl border-none bg-transparent p-0"
                      type="button"
                      onClick={() => setOpenIndex(idx)}
                    >
                      <img
                        alt={product.name?.[LOCALE] ?? 'Product image'}
                        className="rounded-2xl"
                        src={img.url}
                        style={{ objectFit: 'contain' }}
                      />
                    </button>
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
                <h2 className="mb-3 font-medium">Specifications</h2>
                <div className="flex flex-wrap gap-2">
                  {variant.attributes.map((attr: any) => (
                    <Chip key={attr.name} color="primary" variant="bordered">
                      <span className="mr-1 text-xs text-gray-500">
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

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          role="button"
          tabIndex={0}
          onClick={closeFullscreen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
              closeFullscreen();
            }
          }}
        >
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div
            className="relative flex size-full items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-4 top-4 z-50 text-3xl text-white"
              onClick={closeFullscreen}
            >
              &times;
            </button>

            <Swiper
              loop
              navigation
              className="size-full"
              initialSlide={openIndex}
              modules={[Navigation, Pagination]}
              pagination={{ clickable: true }}
              slidesPerView={1}
              spaceBetween={10}
            >
              {variant.images?.map((img: any) => (
                <SwiperSlide key={img.url}>
                  <div className="flex h-full items-center justify-center">
                    <img
                      alt={product.name?.[LOCALE] ?? 'Product image'}
                      className="rounded-2xl"
                      src={img.url}
                      style={{
                        maxWidth: '90%',
                        maxHeight: '90%',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
}
