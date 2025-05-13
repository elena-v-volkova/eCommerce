import { useState } from 'react';
import { useNavigate } from 'react-router';

import { createPasswordFlowClient } from '@/commercetools/login';
import { AppRoute } from '@/routes/appRoutes';
import { useSession } from '@/shared/model/useSession';

interface LoginError {
  message: string;
  statusCode?: number;
  [key: string]: any;
}

const useLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useSession();

  const fetchUser = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError(null);
    if (!email && !password) return;
    try {
      const loginClient = createPasswordFlowClient(email, password);
      const response = await loginClient
        .login()
        .post({
          body: {
            email: email,
            password,
          },
        })
        .execute();

      login(response.body.customer);
      navigate(AppRoute.home, { replace: true });
    } catch (err) {
      const loginError = err as LoginError;
      let errorMessage = 'Login failed. Please try again.';

      if (loginError.statusCode === 400) {
        errorMessage = 'Invalid email or password.';
      } else if (loginError.statusCode === 401) {
        errorMessage = 'Unauthorized. Please check your credentials.';
      }
      setError(errorMessage);
      console.error('Login error:', loginError.message, loginError);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchUser,
    isLoading,
    error,
  };
};

export default useLogin;
