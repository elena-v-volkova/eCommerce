import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { createPasswordFlowClient } from '@/commercetools/login';
import { AppRoute } from '@/routes/appRoutes';
import { useAuth } from '@/shared/model/AuthContext';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

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
      const { body: customer } = await loginClient.me().get().execute();
      // .login()
      // .post({ body: { email, password } })
      // .execute();

      login(customer);
      navigate(AppRoute.home, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchUser, isLoading, error };
};
