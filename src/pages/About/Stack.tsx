import { Image } from '@heroui/react';

import heroui from '../../assets/logos/heroui.png';
import lucide from '../../assets/logos/lucide.svg';
import react from '../../assets/logos/react.svg';
import router from '../../assets/logos/router.webp';
import tailwind from '../../assets/logos/tailwindcss.svg';
import typescript from '../../assets/logos/ts.svg';
import zod from '../../assets/logos/zod.webp';

export function Stack() {
  return (
    <div className="mt-3 flex flex-wrap gap-5 self-center">
      <Image alt="react" height={50} radius="none" src={react} />
      <Image alt="router" height={50} radius="none" src={router} />
      <Image alt="typescript" height={50} radius="none" src={typescript} />
      <Image alt="zod" height={50} src={zod} />
      <Image alt="hero-ui" height={50} radius="none" src={heroui} />
      <Image alt="tailwind" height={50} radius="none" src={tailwind} />
      <Image alt="lucide" height={50} radius="none" src={lucide} />
    </div>
  );
}
