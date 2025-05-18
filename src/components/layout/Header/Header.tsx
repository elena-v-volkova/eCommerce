import { Logo } from '@/components/Icons';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { SITE_CONFIG } from '@/config/site';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/navbar';
import React from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2" color="foreground">
            <Logo />
            <p className="font-bold text-inherit">ACME</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {SITE_CONFIG.navItems.map((item, index) => (
          <NavbarItem key={`${item.label}-${index}`}>
            <Link href={item.href} color="foreground">
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className=" lg:flex">
          <Button
            as={Link}
            href="/login"
            color="primary"
            variant="flat"
            size="sm"
          >
            Login
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            href="/register"
            color="primary"
            variant="flat"
            size="sm"
          >
            Sign Up
          </Button>
        </NavbarItem>
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {SITE_CONFIG.navItems.map((item, index) => (
          <NavbarMenuItem key={`${item.label}-${index}`}>
            <Link
              href={item.href}
              className="w-full"
              size="lg"
              color="foreground"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
