export type SiteConfig = typeof SITE_CONFIG;

export const SITE_CONFIG = {
  name: 'Vite + HeroUI',
  description: 'Make beautiful websites regardless of your design experience.',
  navItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'About',
      href: '/about',
    },
    {
      label: 'Catalog',
      href: '/catalog',
    },
  ],

  authLinks: [
    { label: 'Login', href: '/login' },
    { label: 'Sign Up', href: '/register' },
  ],

  links: {
    docs: 'https://heroui.com',
  },
};
