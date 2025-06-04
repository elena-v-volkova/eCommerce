import { useEffect, useMemo, useState } from 'react';
import { UserRoundCog } from 'lucide-react';
import { Customer } from '@commercetools/platform-sdk';

import { Selectors } from './Selectors';
import styles from './ProfilePage.module.scss';
import { PersonalContent } from './PersonalContent';
import { AddressContent } from './AddressContent';
import { PasswordUpdate } from './PasswordUpdate';

import { useAuth } from '@/shared/model/AuthContext';
import { useSession } from '@/shared/model/useSession.ts';

export function Profile() {
  const { logout }: { logout: () => void } = useAuth();
  const { user } = useSession();
  const [subpage, setSubpage] = useState<string>('');

  const copyCustomer = (value: Customer): Customer => {
    return JSON.parse(JSON.stringify(value));
  };

  let customer: Customer;

  if (user) customer = copyCustomer(user);
  useEffect(() => {
    console.log('>>> User сменился :', { user });
    customer = copyCustomer(user as Customer);
  }, [user]);

  const content = useMemo(() => {
    switch (subpage) {
      case 'addresses':
        return <AddressContent value={customer} />;
      case 'password':
        return <PasswordUpdate />;
      case 'logout':
        logout();

        return null;
      case 'personal':
        return <PersonalContent customer={customer} />;
      default:
        return (
          <UserRoundCog className="size-full max-w-[350px] stroke-[#eeeec3] dark:stroke-[#777773]" />
        );
    }
  }, [subpage, user]);

  return (
    <div className="flex w-full flex-col flex-wrap items-stretch">
      <h2 className="mb-10 flex w-full justify-center self-center text-[2.3rem] font-semibold leading-9 lg:text-5xl">
        User Profile Page
      </h2>
      <div className={styles.profile}>
        <Selectors onAction={(key) => setSubpage(key.toString())} />
        <div className="mx-[20px]  flex   min-h-[180px] w-full justify-center ">
          {content}
        </div>
      </div>
    </div>
  );
}
