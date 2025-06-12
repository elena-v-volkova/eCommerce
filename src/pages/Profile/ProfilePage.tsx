import { UserRoundCog } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router';
import { useEffect } from 'react';

import { Selectors } from './Selectors';
import styles from './ProfilePage.module.scss';

import { useAuth } from '@/shared/model/AuthContext';
import { AppRoute } from '@/routes/appRoutes';

export function Profile() {
  return (
    <div className="flex w-full flex-col flex-wrap items-stretch">
      <h2 className="mb-10 flex w-full justify-center self-center text-[2.3rem] font-semibold leading-9 lg:text-5xl">
        User Profile Page
      </h2>
      <div className={styles.profile}>
        <Selectors />
        <div className="mx-[20px] flex min-h-[180px] w-full justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function DefaultProfileContent() {
  return (
    <UserRoundCog className="size-full max-w-[350px] stroke-[#eeeec3] dark:stroke-[#777773]" />
  );
}

export function LogoutHandler() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate(AppRoute.home);
  }, [logout]);

  return null;
}
