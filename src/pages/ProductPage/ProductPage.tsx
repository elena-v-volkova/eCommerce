import type { Swiper as SwiperType } from 'swiper';

import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo, useRef } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Spinner,
} from '@heroui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import { Price, ProductProjection } from './productPage.types';

import { apiAnonRoot } from '@/commercetools/anonUser';

export default function ProductPage() {
  const { key } = useParams() as { key: string };
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductProjection | null>(null);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const mainSwiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    if (openIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [openIndex]);

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

  const { regularPrice, discountedPrice } = useMemo(() => {
    if (!variant?.prices?.length) {
      return { regularPrice: null, discountedPrice: null };
    }

    const now = new Date();
    const allPrices = variant.prices.filter(
      (pr: Price) => pr.value.currencyCode === CURRENCY,
    );

    let activeDiscount: Price | null = null;
    let basePrice: Price | null = null;

    allPrices.forEach((pr: Price) => {
      const { validFrom, validUntil } = pr;

      if (validFrom && validUntil) {
        const from = new Date(validFrom);
        const until = new Date(validUntil);

        if (from <= now && now <= until) {
          activeDiscount = pr;
        }
      }
    });

    if (activeDiscount) {
      basePrice =
        allPrices.find((pr) => pr.id !== activeDiscount!.id) || allPrices[0];
    } else {
      basePrice = allPrices[0];
    }

    const format = (pr: Price) =>
      (pr.value.centAmount / 100).toLocaleString(undefined, {
        style: 'currency',
        currency: CURRENCY,
      });

    return {
      regularPrice: basePrice ? format(basePrice) : null,
      discountedPrice: activeDiscount ? format(activeDiscount) : null,
    };
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
      <RouterLink
        className="text-sm text-gray-500 hover:underline"
        to="/catalog"
      >
        &larr; Back
      </RouterLink>

      <Card className="overflow-hidden" radius="lg" shadow="lg">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="order-2 flex justify-center p-4 md:order-1 md:block">
            <div className="mx-auto h-56 w-[70vw] overflow-hidden sm:h-64 md:mx-0 md:h-80 md:w-full lg:h-96">
              <Swiper
                loop
                navigation
                className="size-full"
                modules={[Navigation, Pagination]}
                pagination={{ clickable: true }}
                slidesPerView={1}
                spaceBetween={10}
                onSwiper={(swiper) => {
                  mainSwiperRef.current = swiper;
                }}
              >
                {variant.images?.map((img, idx) => (
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
          </div>

          <div className="order-1 space-y-6 p-6 md:order-2">
            <CardHeader className="p-0">
              <h1 className="whitespace-normal break-words text-3xl font-bold">
                {product.name?.[LOCALE] ?? 'Untitled product'}
              </h1>
            </CardHeader>

            {regularPrice && !discountedPrice && (
              <p className="text-2xl font-semibold">{regularPrice}</p>
            )}

            {regularPrice && discountedPrice && (
              <p className="flex items-baseline gap-4">
                <span className="text-gray-500 line-through">
                  {regularPrice}
                </span>
                <span className="text-2xl font-semibold">
                  {discountedPrice}
                </span>
              </p>
            )}

            {product.description?.[LOCALE] && (
              <CardBody className="p-0">
                <p className="whitespace-normal break-words text-base leading-relaxed">
                  {product.description[LOCALE]}
                </p>
              </CardBody>
            )}

            {variant.attributes?.length && (
              <div>
                <h2 className="mb-3 whitespace-normal break-words font-medium">
                  Specifications
                </h2>
                <div className="flex flex-wrap gap-2">
                  {variant.attributes.map((attr) => (
                    <Chip key={attr.name} color="primary" variant="bordered">
                      <span className="mr-1 text-xs text-gray-500">
                        {attr.name}:
                      </span>
                      <span className="whitespace-normal break-words">
                        {typeof attr.value === 'object'
                          ? (attr.value.label ?? attr.value.key)
                          : attr.value.toString()}
                      </span>
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
          className="fixed inset-0 z-50 bg-black bg-opacity-90"
          role="button"
          tabIndex={0}
          onClick={closeFullscreen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
              closeFullscreen();
            }
          }}
        >
          <Button
            className="absolute left-1/2 top-[10vh] flex h-[80vh] w-[90vw] -translate-x-1/2 items-center justify-center md:w-[60vw] lg:w-[50vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -right-2.5 -top-2.5 z-50 text-3xl text-white"
              type="button"
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
              {variant.images?.map((img) => (
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
          </Button>
        </div>
      )}
    </div>
  );
}
