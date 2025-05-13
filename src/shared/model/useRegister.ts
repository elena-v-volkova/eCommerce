import { useState } from 'react';

import { apiAnonRoot } from '@/commercetools/anonUser';
import useLogin from '@/components/LoginForm/hooks/useLogin';

interface LoginError {
  message: string;
  statusCode?: number;
  [key: string]: any;
}

const useRegister = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchUser } = useLogin();

  const createCustomer = async (customerDraft: any) => {
    setIsLoading(true);
    setError(null);
    if (!customerDraft) return;
    try {
      const result = await apiAnonRoot
        .customers()
        .post({
          body: customerDraft,
        })
        .execute();
      const responseCustomer = result.body.customer;

      if (responseCustomer) {
        fetchUser(customerDraft);
      }
    } catch (err) {
      const loginError = err as LoginError;
      let errorMessage = 'Register failed. Please try again.';

      if (loginError.statusCode === 400) {
        errorMessage = 'Invalid Data.';
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
    createCustomer,
    isLoading,
    error,
  };
};

export default useRegister;
