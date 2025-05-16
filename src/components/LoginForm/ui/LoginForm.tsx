import { Button } from '@heroui/button';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router';
import { useState } from 'react';

import { TLoginFieldsSchema, LOGIN_SCHEMA } from '../lib/loginSchema';
import useLogin from '../hooks/useLogin';

import styles from './LoginForm.module.scss';

import { AppRoute } from '@/routes/appRoutes';
import DefaultLayout from '@/layouts/Default';
import { EyeFilledIcon, EyeSlashFilledIcon } from '@/components/Icons';

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginFieldsSchema>({
    resolver: zodResolver(LOGIN_SCHEMA),
  });
  const { fetchUser, isLoading, error } = useLogin();

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <DefaultLayout>
      <div className={styles.login}>
        <Form
          className="flex w-full max-w-xs flex-col gap-4"
          onSubmit={handleSubmit(fetchUser)}
        >
          <Input
            label="Email"
            labelPlacement="outside"
            placeholder="Enter your email"
            type="email"
            {...register('email')}
            errorMessage={errors.email?.message}
            isInvalid={errors.email?.message ? true : false}
          />

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
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
                ) : (
                  <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
                )}
              </button>
            }
            errorMessage={errors.password?.message}
            isInvalid={errors.password?.message ? true : false}
            type={isVisible ? 'text' : 'password'}
          />
          <div className="flex gap-2">
            <Button color="primary" isDisabled={isLoading} type="submit">
              Login
            </Button>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <NavLink
              className="underline underline-offset-4"
              to={`/${AppRoute.register}`}
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
