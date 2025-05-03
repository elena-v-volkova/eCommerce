import Header from '../../components/layout/Header/Header';
import styles from './Login.module.scss';

function Login() {
  return (
    <div className={styles.login}>
      <Header />
      <h1>Login Page</h1>
    </div>
  );
}

export default Login;
