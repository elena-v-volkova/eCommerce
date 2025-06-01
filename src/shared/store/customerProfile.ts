import {
  BaseAddress,
  ClientResponse,
  Customer,
  CustomerUpdateAction,
  MyCustomerChangePassword,
} from '@commercetools/platform-sdk';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { InvalidCurrentPasswordError } from '@commercetools/platform-sdk';

import { useSession } from '../model/useSession';

import { getCountryInfo } from './countries';
import { ADDRESS_ACTION, PERSONAL_DATA_ACTION } from './updateUtils';

import { apiAnonRoot } from '@/commercetools/anonUser';
import { createPasswordFlowClient } from '@/commercetools/login';
import { ResponseError } from '@/types/commercetools';
import { PersonalFields } from '@/pages/Profile/PersonalContent';

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
  const notifyToast = (msg: string) => {
    toast.success(msg, {
      duration: 5000,
      style: {
        fontSize: '1.25rem',
        padding: '16px 24px',
      },
    });
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

  const editPersonal = async (personal: PersonalFields): Promise<void> => {
    setIsLoading(true);
    setError(null);
    const request: CustomerUpdateAction[] = [
      PERSONAL_DATA_ACTION.changeEmail(personal.email),
      PERSONAL_DATA_ACTION.setFirstName(personal.firstName),
      PERSONAL_DATA_ACTION.setLastName(personal.lastName),
      PERSONAL_DATA_ACTION.setDateOfBirth(personal.dateOfBirth),
    ];
    await apiAnonRoot
      .customers()
      .withId({ ID: user.id })
      .post({
        body: {
          version: version,
          actions: request,
        },
      })
      .execute()
      .then((data: ClientResponse<Customer>) => {
        notifyToast('Personal data changed!');
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

  return {
    changePassword,
    isLoading,
    error,
    resetError,
    editAddress,
    editPersonal,
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
