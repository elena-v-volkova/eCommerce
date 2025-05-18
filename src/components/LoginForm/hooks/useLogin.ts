import { useState } from 'react';
import { useNavigate } from 'react-router';

import { createPasswordFlowClient } from '@/commercetools/login';
import { AppRoute } from '@/routes/appRoutes';
import { useSession } from '@/shared/model/useSession';
import { ResponseError } from '@/types/commercetools';

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
    const loginClient = createPasswordFlowClient(email, password);

    await loginClient
      .login()
      .post({
        body: {
          email: email,
          password,
        },
      })
      .execute()
      .then((data) => {
        login(data.body.customer);
        navigate(AppRoute.home, { replace: true });
      })
      .catch((error) => {
        const loginError = error as ResponseError;

        setError(loginError.message);
      })
      .finally(() => setIsLoading(false));
  };

  return {
    fetchUser,
    isLoading,
    error,
  };
};

export default useLogin;
