import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { createPasswordFlowClient } from '@/commercetools/login';
import { AppRoute } from '@/routes/appRoutes';
import { useAuth } from '@/shared/model/AuthContext';
import { clearCartId, getCartId } from '@/shared/utils/anonymousId';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  // const { setCart } = useCart();
  const fetchUser = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    if (!email || !password) return;
    setIsLoading(true);
    setError(null);

    try {
      const loginClient = createPasswordFlowClient(email, password);
      const { body: customer } = await loginClient
        // .get().execute();
        .login()
        .post({
          body: {
            email,
            password,
            anonymousCartId: getCartId()!,
            anonymousCartSignInMode: 'MergeWithExistingCustomerCart',
          },
        })
        .execute();

      clearCartId();

      login(customer.customer);
      navigate(AppRoute.home, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchUser, isLoading, error };
};
