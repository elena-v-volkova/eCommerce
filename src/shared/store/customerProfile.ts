import {
  BaseAddress,
  ClientResponse,
  Customer,
  MyCustomerChangePassword,
} from '@commercetools/platform-sdk';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { InvalidCurrentPasswordError } from '@commercetools/platform-sdk';

import { useSession } from '../model/useSession';

import { getCountryInfo } from './countries';
import { ADDRESS_ACTION } from './updateUtils';

import { apiAnonRoot } from '@/commercetools/anonUser';
import { createPasswordFlowClient } from '@/commercetools/login';
import { ResponseError } from '@/types/commercetools';

export function CustomerSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser, user } = useSession();
  const [error, setError] = useState<string | null>(null);
  const resetError = (): void => setError(null);
  const [version, setVersion] = useState(user?.version || 1);

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

    const notifyToast = (msg: string) => {
      toast.success(msg, {
        duration: 5000,
        style: {
          fontSize: '1.25rem',
          padding: '16px 24px',
        },
      });
    };

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

        notifyToast('Password successful changed!');
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

  const editAddress = async (
    addressId: string,
    address: BaseAddress,
  ): Promise<Customer | void> => {
    setIsLoading(true);
    setError(null);
    if (!addressId || !address) return;

    const draft = JSON.parse(JSON.stringify(address));

    Object.defineProperties(draft, {
      firstName: {
        value: user?.firstName,
        enumerable: true,
      },
      lastName: {
        value: user?.lastName,
        enumerable: true,
      },
      country: {
        value: getCountryInfo(address.country)?.code,
        enumerable: true,
      },
    });
    const request = ADDRESS_ACTION.change(addressId, draft);

    console.log(request);

    await apiAnonRoot
      .customers()
      .withId({ ID: user.id })
      .post({
        body: {
          version: version,
          actions: [request],
        },
      })
      .execute()
      .then((data: ClientResponse<Customer>) => {
        notifyToast('Address successful changed!');
        updateLocalClient(data.body);
      })
      .catch((error: ResponseError) => {
        setError(error.message);
        throw new Error(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const editPersonal = async (): Promise<void> => {
    return;
  };

  return {
    changePassword,
    isLoading,
    error,
    resetError,
    editAddress,
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
