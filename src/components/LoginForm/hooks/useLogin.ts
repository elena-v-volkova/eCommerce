import { useState } from 'react';
import { CustomerSignInResult } from '@commercetools/platform-sdk';

import { createPasswordFlowClient } from '@/commercetools/login';

interface LoginError {
  message: string;
  statusCode?: number;
  [key: string]: any;
}

const useLogin = () => {
  const [user, setUser] = useState<CustomerSignInResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
