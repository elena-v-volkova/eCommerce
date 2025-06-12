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
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';
import { useNavigate } from 'react-router-dom';

import styles from './Header.module.scss';
import { CartItem } from './CartItem';

import { SITE_CONFIG } from '@/config/site';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { Logo } from '@/components/Icons';
import { useAuth } from '@/shared/model/AuthContext';
import { AppRoute } from '@/routes/appRoutes';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
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
            <p className="font-bold text-inherit">Car House</p>
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
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                showFallback
                classNames={{
                  base: 'bg-gradient-to-br from-[#FFB457] to-[#FF905B] ',
                  name: styles.profile,
                }}
                name={[user.firstName?.[0], user.lastName?.[0]].join('')}
                size="sm"
                style={{ cursor: 'pointer' }}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem
                key="profile"
                className="h-14 gap-2"
                textValue={`Hello ${user.firstName} ${user.lastName}`} // Add this
              >
                <p className="font-semibold">
                  Hello {user.firstName} {user.lastName}
                </p>
              </DropdownItem>

              <DropdownItem
                key="settings"
                showDivider
                textValue="My Profile"
                onPressUp={() => navigate(AppRoute.profile, { replace: true })}
              >
                My Profile
              </DropdownItem>

              <DropdownItem
                key="logout"
                color="danger"
                textValue="Log Out"
                onPressUp={logout}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <>
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                href={AppRoute.login}
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
                href={AppRoute.register}
                size="sm"
                variant="flat"
              >
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
        <NavbarItem>
          <CartItem />
        </NavbarItem>
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
