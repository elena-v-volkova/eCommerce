import styles from './NotFound.module.scss';

import DefaultLayout from '@/layouts/Default';

function NotFound() {
  return (
    <DefaultLayout>
      <div className={styles.not_found}>
        <h1>404</h1>
      </div>
    </DefaultLayout>
  );
}

export default NotFound;
