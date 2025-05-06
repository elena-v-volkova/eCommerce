import DefaultLayout from '@/layouts/Default';
import styles from './Login.module.scss';

function Login() {
  return (
    <DefaultLayout>
      <div className={styles.login}>
        <h1>Login Page</h1>
      </div>
    </DefaultLayout>
  );
}

export default Login;
