import {
  ClientResponse,
  Customer,
  MyCustomerChangePassword,
} from '@commercetools/platform-sdk';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { InvalidCurrentPasswordError } from '@commercetools/platform-sdk';

import { useSession } from '../model/useSession';

import { createPasswordFlowClient } from '@/commercetools/login';

export function CustomerSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, user } = useSession();

  const resetError = (): void => setError(null);

  const changePassword = async (
    data: MyCustomerChangePassword,
  ): Promise<Customer | void> => {
    const passwordClient = createPasswordFlowClient(
      user.email,
      data.currentPassword,
    );

    setIsLoading(true);
    setError(null);
    if (!data) return;
    console.log(data);
    await passwordClient
      .me()
      .password()
      .post({
        body: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          version: data.version,
        },
      })
      .execute()
      .then(async (response: ClientResponse<Customer>) => {
        const customer = response.originalRequest;
        console.log(customer);

        toast.success('Password successful changed!', {
          duration: 5000,
          style: {
            fontSize: '1.25rem',
            padding: '16px 24px',
          },
        });
        const newClient = createPasswordFlowClient(
          user.email,
          data.newPassword,
        );

        const { body: updatedCustomer } = await newClient.me().get().execute();

        console.log(updatedCustomer);
        login(updatedCustomer);
      })
      .catch((error) => {
        isInvalidCurrentPasswordError(error)
          ? setError('Invalid Current Password')
          : setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return {
    changePassword,
    isLoading,
    error,
    resetError,
  };
}

function isInvalidCurrentPasswordError(
  error: unknown,
): error is InvalidCurrentPasswordError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'InvalidCurrentPassword'
  );
}
