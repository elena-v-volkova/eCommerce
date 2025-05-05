import Header from '../../components/layout/Header/Header';
import styles from './NotFound.module.scss';

function NotFound() {
  return (
    <div className={styles.notFound}>
      <Header />
      <h1>404</h1>
    </div>
  );
}

export default NotFound;
