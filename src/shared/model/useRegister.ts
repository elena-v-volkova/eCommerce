import { useState } from 'react';
import { useNavigate } from 'react-router';

import { useSession } from './useSession';

import { apiAnonRoot } from '@/commercetools/anonUser';
import { MyCustomerDraft, ResponseError } from '@/types/commercetools';
import { AppRoute } from '@/routes/appRoutes';

function useRegister() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useSession();
  const navigate = useNavigate();
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
      .then((data) => {
        login(data.body.customer);
        navigate(AppRoute.home, { replace: true });
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
