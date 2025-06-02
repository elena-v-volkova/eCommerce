import { ReactNode, useEffect, useState } from 'react';
import { UserRoundCog } from 'lucide-react';
import { Customer } from '@commercetools/platform-sdk';

import { Selectors } from './Selectors';
import styles from './ProfilePage.module.scss';
import { PersonalContent } from './PersonalContent';
import { AddressContent } from './AddressContent';
import { PasswordUpdate } from './PasswordUpdate';

import { useAuth } from '@/shared/model/AuthContext';

export function Profile() {
  const {
    user,
    logout,
  }: { readonly user: Customer | null; logout: () => void } = useAuth();
  const [subpage, setSubpage] = useState<string>('');
  const [content, setContent] = useState<ReactNode>(null);

  useEffect(() => {
    switch (subpage) {
      case 'addresses':
        setContent(AddressesContent(user));
        break;
      case 'password':
        setContent(<PasswordUpdate />);
        break;
      case 'logout':
        logout();
        break;
      case 'personal':
        setContent(<PersonalContent customer={user} />);
        break;
      default:
        setContent(
          <UserRoundCog className="size-full max-w-[350px] stroke-[#eeeec3] dark:stroke-[#777773]" />,
        );
        break;
    }
  }, [subpage]);

  return (
    <div className="w-full">
      <h2 className="mb-10 flex w-full justify-center self-center text-[2.3rem] font-semibold leading-9 lg:text-5xl">
        User Profile Page
      </h2>
      <div className={styles.profile}>
        <Selectors onAction={(key) => setSubpage(key.toString())} />
        <div className="mx-[20px] flex min-h-[180px] w-full justify-center">
          {content}
        </div>
      </div>
    </div>
  );
}

function AddressesContent(customer: Customer | null) {
  return (
    <div className="mx-[20px] flex w-full flex-col gap-y-[20px]">
      <p className="inline-flex self-center">Manage addresses</p>
      {customer ? <AddressContent value={customer} /> : <></>}
    </div>
  );
}
