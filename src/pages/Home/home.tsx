import Header from '../../components/layout/Header/Header';
import styles from './Home.module.scss';

function Home() {
  return (
    <div className={styles.home}>
      <Header />
      <h1>Home Page</h1>
    </div>
  );
}

export default Home;
