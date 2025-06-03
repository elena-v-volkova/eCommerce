import styles from './ProfilePage.module.scss';

import UserProfilePage from '@/components/ProfilePage/UserProfilePage';

export function Profile() {
  return (
    <div className={styles.profile}>
      <UserProfilePage />
    </div>
  );
}
