import { Button } from '@heroui/button';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router';

import { LOGIN_SCHEMA, TFormFiledsSchema } from '../lib/loginSchema';
import useLogin from '../hooks/useLogin';

import styles from './LoginForm.module.scss';

import { AppRoute } from '@/routes/AppRoutes';
import DefaultLayout from '@/layouts/Default';

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TFormFiledsSchema>({
    resolver: zodResolver(LOGIN_SCHEMA),
  });

  const onSubmitLoginForm = async () => {
    console.log('asdass');
  };

  return (
    <DefaultLayout>
      <div className={styles.login}>
        <Form
          className="flex w-full max-w-xs flex-col gap-4"
          onSubmit={handleSubmit(onSubmitLoginForm)}
        >
          <Input
            label="Email"
            labelPlacement="outside"
            placeholder="Enter your email"
            {...register('email')}
            isInvalid={false}
            type="email"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
          <NavLink
            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
            to="#"
          >
            Forgot your password?
          </NavLink>
          <Input
            label="Password"
            labelPlacement="outside"
            placeholder="Enter your password"
            {...register('password')}
            type="password"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
          <div className="flex gap-2">
            <Button color="primary" type="submit">
              Login
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <NavLink
              className="underline underline-offset-4"
              to={AppRoute.register}
            >
              Sign up
            </NavLink>
          </div>
        </Form>
      </div>
    </DefaultLayout>
  );
};

export default LoginForm;
