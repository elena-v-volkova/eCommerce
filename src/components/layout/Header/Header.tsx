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
import { useState } from 'react';
import { Avatar } from '@heroui/react';
import { useNavigate } from 'react-router-dom';

import styles from './Header.module.scss';

import { SITE_CONFIG } from '@/config/site';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { Logo } from '@/components/Icons';
import { useAuth } from '@/shared/model/AuthContext';
import { AppRoute } from '@/routes/appRoutes';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Navbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link className="flex items-center gap-2" color="foreground" href="/">
            <Logo />
            <p className="font-bold text-inherit">ACME</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        {SITE_CONFIG.navItems.map((item, index) => (
          <NavbarItem key={`${item.label}-${index}`}>
            <Link color="foreground" href={item.href}>
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        {user ? (
          <Avatar
            isBordered
            showFallback
            classNames={{
              base: 'bg-gradient-to-br from-[#FFB457] to-[#FF905B]',
              name: styles.profile,
            }}
            name={[user.firstName?.[0], user.lastName?.[0]]
              .filter(Boolean)
              .join('')}
            size="sm"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(AppRoute.profile, { replace: true })}
          />
        ) : (
          <>
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                href="/login"
                size="sm"
                variant="flat"
              >
                Login
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                href="/register"
                size="sm"
                variant="flat"
              >
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {SITE_CONFIG.navItems.map((item, index) => (
          <NavbarMenuItem key={`${item.label}-${index}`}>
            <Link
              className="w-full"
              color="foreground"
              href={item.href}
              size="lg"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
