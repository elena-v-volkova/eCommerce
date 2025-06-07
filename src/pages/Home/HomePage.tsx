import { Link } from '@heroui/link';
import { Snippet } from '@heroui/snippet';
import { Code } from '@heroui/code';
import { button as buttonStyles } from '@heroui/theme';
import { Image } from '@heroui/react';

import car from '../../assets/car.jpg';

import { SITE_CONFIG } from '@/config/site';
import { TITLE, SUBTITLE } from '@/components/primitives';
// import { loadMockUser } from '@/shared/utils/utils';

function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      {/* <Button
        className="text-tiny"
        color="default"
        onClick={() => loadMockUser()}
      >
        Load Mock data
      </Button>*/}
      <div className="inline-block max-w-lg justify-center text-center">
        <span className={TITLE()}>Buy&nbsp;</span>
        <span className={TITLE({ color: 'violet' })}>beautiful&nbsp;</span>
        <span className={SUBTITLE()}>
          Discover classic cars in pristine condition, where timeless elegance
          meets unmatched performance.
        </span>
      </div>
      <Image alt="Main Image" className="dark:invert" src={car} />
      <div className="flex gap-3">
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
      </div>

      <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="bordered">
          <span>
            Get started by editing <Code color="primary">Home.tsx</Code>
          </span>
        </Snippet>
      </div>
    </section>
  );
}

export default Home;
