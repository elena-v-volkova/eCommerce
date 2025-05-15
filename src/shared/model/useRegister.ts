import { useState } from 'react';

import { apiAnonRoot } from '@/commercetools/anonUser';
import useLogin from '@/components/LoginForm/hooks/useLogin';
import { MyCustomerDraft, ResponseError } from '@/types/commercetools';

function useRegister() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchUser } = useLogin();

  const createCustomer = async (customerDraft: MyCustomerDraft) => {
    setIsLoading(true);
    setError(null);
    if (!customerDraft) return;
    await apiAnonRoot
      .customers()
      .post({
        body: customerDraft,
      })
      .execute()
      .then(() => fetchUser(customerDraft))
      .catch((err) => {
        const loginError = err as ResponseError;

        setError(loginError.message);
        console.error('Login error:', loginError.message, loginError);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return {
    createCustomer,
    isLoading,
    error,
  };
}

export default useRegister;
