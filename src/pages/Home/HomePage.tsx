import { Link } from '@heroui/link';
import { Snippet } from '@heroui/snippet';
import { Code } from '@heroui/code';
import { button as buttonStyles } from '@heroui/theme';

import { SITE_CONFIG } from '@/config/site';
import { TITLE, SUBTITLE } from '@/components/primitives';
import { GithubIcon } from '@/components/Icons';

function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg justify-center text-center">
        <span className={TITLE()}>Make&nbsp;</span>
        <span className={TITLE({ color: 'violet' })}>beautiful&nbsp;</span>
        <br />
        <span className={TITLE()}>
          websites regardless of your design experience.
        </span>
        <div className={SUBTITLE({ class: 'mt-4' })}>
          Beautiful, fast and modern React UI library.
        </div>
      </div>

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
