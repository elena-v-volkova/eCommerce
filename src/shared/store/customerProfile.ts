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
  const { updateUser, user } = useSession();
  const [error, setError] = useState<string | null>(null);
  const resetError = (): void => setError(null);
  const [version, setVersion] = useState(user.version);

  const updateLocalClient = async (value: Customer): Promise<void> => {
    setVersion(value.version);
    updateUser(value);
  };

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
          version: version,
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

        updateLocalClient(updatedCustomer);
      })
      .catch((error) => {
        isInvalidCurrentPasswordError(error)
          ? setError('Invalid Current Password')
          : setError(error.code);
        throw new Error();
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
