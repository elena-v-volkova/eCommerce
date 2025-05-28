import { useEffect, useState } from 'react';
import { Customer } from '@commercetools/platform-sdk';
import { UserRoundCog } from 'lucide-react';

import { Selectors } from './Selectors';
import styles from './ProfilePage.module.scss';

import { useAuth } from '@/shared/model/AuthContext';
export function Profile() {
  const { user } = useAuth();
  const [subpage, setSubpage] = useState<string>('');
  const [content, setContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    switch (subpage) {
      case 'addresses':
        setContent(AddressesContent(user));
        break;
      case 'password':
        setContent(PasswordContent);
        break;
      case 'logout':
        break;
      case 'personal':
        setContent(PersonalInfoContent(user));
        break;
      default:
        setContent(
          <UserRoundCog className="size-full max-w-[350px] stroke-[#eeeec3] dark:stroke-[#777773]" />,
        );
        break;
    }
  }, [subpage]);

  return (
    <>
      <h2 className="mb-10 flex w-full justify-center  self-center text-[2.3rem]   font-semibold leading-9 lg:text-5xl  ">
        User Profile Page
      </h2>
      <div className={styles.profile}>
        <Selectors onAction={(key) => setSubpage(key.toString())} />
        <div className="mx-[20px] flex    min-h-[180px] w-full justify-center  ">
          {content}
        </div>
      </div>
    </>
  );
}

function PersonalInfoContent(user: Customer | null) {
  return <div>Your Information</div>;
}

function AddressesContent(user: Customer | null) {
  return <div>Manage addresses</div>;
}

function PasswordContent() {
  return <div>Write new password</div>;
}
