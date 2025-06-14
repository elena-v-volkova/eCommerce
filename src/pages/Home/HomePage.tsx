import { Image, Spinner } from '@heroui/react';

import car from '../../assets/car.jpg';

import { Discounts } from './DiscountCard';

import { TITLE, SUBTITLE } from '@/components/primitives';
import { useCart } from '@/shared/context/CartContext';

function Home() {
  const { discounts, loading, error } = useCart();

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg justify-center text-center">
        <span className={TITLE()}>Buy&nbsp;</span>
        <span className={TITLE({ color: 'violet' })}>beautiful&nbsp;</span>
        <span className={SUBTITLE()}>
          Discover classic cars in pristine condition, where timeless elegance
          meets unmatched performance.
        </span>
      </div>
      <Image alt="Main Image" className="dark:invert" src={car} />
      {/* <div className="flex gap-3">
        <Link
          isExternal
          className={buttonStyles({
            color: 'primary',
            radius: 'full',
            variant: 'shadow',
          })}
          href={SITE_CONFIG.links.docs}
        >
          Documentation
        </Link>
      </div> */}

      <div className="mt-2 flex w-full  justify-center ">
        {/* <Snippet hideCopyButton hideSymbol variant="bordered">
          <span>
            Get started by editing <Code color="primary">Home.tsx</Code>
          </span>
        </Snippet> */}
        {loading ? (
          <Spinner size="lg" />
        ) : error ? (
          <div className="text-center text-danger">{error}</div>
        ) : discounts ? (
          <Discounts data={discounts} />
        ) : null}
      </div>
    </section>
  );
}

export default Home;
