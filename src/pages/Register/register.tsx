import DefaultLayout from '@/layouts/Default';
import styles from './Register.module.scss';

function Register() {
  return (
    <DefaultLayout>
      <div className={styles.register}>
        <h1>Register Page</h1>
      </div>
    </DefaultLayout>
  );
}

export default Register;
