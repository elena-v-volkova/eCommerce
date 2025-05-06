import DefaultLayout from '@/layouts/Default';
import styles from './NotFound.module.scss';

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
