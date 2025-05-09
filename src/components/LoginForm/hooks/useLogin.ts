import { useState } from 'react';
import { CustomerSignInResult } from '@commercetools/platform-sdk';
import { useNavigate } from 'react-router';

import { createPasswordFlowClient } from '@/commercetools/login';
import { AppRoute } from '@/routes/appRoutes';

interface LoginError {
  message: string;
  statusCode?: number;
  [key: string]: any;
}

const useLogin = () => {
  const [user, setUser] = useState<CustomerSignInResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
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

      setUser(response.body);
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
    user,
    isLoading,
    error,
  };
};

export default useLogin;
