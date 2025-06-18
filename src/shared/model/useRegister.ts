import { useState } from 'react';

import { notifyToast } from '../store/Toast';

import { apiAnonRoot } from '@/commercetools/anonUser';
import { MyCustomerDraft, ResponseError } from '@/types/commercetools';
import { useLogin } from '@/components/LoginForm/hooks/useLogin';

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
      .then(() => {
        fetchUser({
          email: customerDraft.email,
          password: customerDraft.password,
        });

        notifyToast('Registration was successful!');
      })
      .catch((err) => {
        const loginError = err as ResponseError;

        setError(loginError.message);
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
