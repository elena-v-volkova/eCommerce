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
import { NewAddressFields } from '@/pages/Profile/AddressContent';

export function CustomerSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser, user, setUser } = useSession();
  const [error, setError] = useState<string | null>(null);
  const resetError = (): void => setError(null);
  const [version, setVersion] = useState(user?.version || 1);

  const updateLocalClient = (value: Customer): void => {
    setVersion(value.version);
    updateUser(value);
    setUser(value);
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
    // console.log(data);
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

        await updateLocalClient(updatedCustomer);

        return customer;
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

  const updateAction = async (
    bodyActions: CustomerUpdateAction[],
    message: string,
    isNotify = true,
  ): Promise<Customer | void> => {
    setIsLoading(true);
    setError(null);
    if (!bodyActions) return;

    return await apiAnonRoot
      .customers()
      .withId({ ID: user.id })
      .post({
        body: {
          version: version,
          actions: [...bodyActions],
        },
      })
      .execute()
      .then((data: ClientResponse<Customer>) => {
        const customer = data.body;

        if (isNotify) notifyToast(message);
        updateLocalClient(customer);

        return customer;
      })
      .catch((error: ResponseError) => {
        setError(error.message);
        throw new Error(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const prepareAddress = (address: BaseAddress): BaseAddress => {
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
        value: getCountryInfo(draft.country)?.code,
        enumerable: true,
      },
    });

    return draft;
  };

  const editAddress = async (
    addressId: string,
    address: BaseAddress,
  ): Promise<Customer | void> => {
    if (!addressId || !address) return;

    const request = ADDRESS_ACTION.change(addressId, prepareAddress(address));

    console.log(request);

    return updateAction([request], 'Address successful changed!');
  };

  const createAddress = async (
    newAddress: NewAddressFields,
  ): Promise<Customer | void> => {
    if (!newAddress) return;
    const address = JSON.parse(JSON.stringify(newAddress.address));

    const getIds = (user: Customer): String[] => {
      return user.addresses.reduce<String[]>(
        (reducer, item: BaseAddress) => {
          reducer.push(item.id || '');

          return reducer;
        },
        [''],
      );
    };
    const oldIds = getIds(user);
    const request = ADDRESS_ACTION.add(prepareAddress(address));

    console.log(oldIds);

    console.log(request);
    console.log(newAddress);

    return updateAction([request], 'Address successful created!', false)
      .then(async (updated) => {
        if (updated) {
          const newId: string | undefined =
            getIds(updated)
              .filter((item) => !oldIds.includes(item))
              .pop()
              ?.toString() || '';
          const canNotify = false;

          if (newAddress.billing === true) {
            await setBilling(newId, canNotify);
            if (newAddress.defaultBilling === true) {
              await setDefaultBilling(newId, canNotify);
            }
          }
          if (newAddress.shipping === true) {
            await setShipping(newId, canNotify);
            if (newAddress.defaultShipping === true) {
              await setDefaultShipping(newId, canNotify);
            }
          }

          notifyToast('Address successful created!');
        }
      })
      .catch();
  };
  const deleteAddress = async (addressId: string): Promise<Customer | void> => {
    if (!addressId) return;
    const request = ADDRESS_ACTION.remove(addressId);

    console.log(request);

    return updateAction([request], 'Address deleted!');
  };

  const setShipping = async (
    addressId: string,
    isNotified = true,
  ): Promise<Customer | void> => {
    return updateAction(
      [ADDRESS_ACTION.setShipping(addressId)],
      'successful',
      isNotified,
    );
  };
  const setBilling = async (
    addressId: string,
    isNotified = true,
  ): Promise<Customer | void> => {
    return updateAction(
      [ADDRESS_ACTION.setBilling(addressId)],
      'successful',
      isNotified,
    );
  };

  const setDefaultBilling = async (
    addressId: string,
    isNotified = true,
  ): Promise<Customer | void> => {
    return updateAction(
      [ADDRESS_ACTION.setDefaultBilling(addressId)],
      'successful',
      isNotified,
    );
  };
  const setDefaultShipping = async (
    addressId: string,
    isNotified = true,
  ): Promise<Customer | void> => {
    return updateAction(
      [ADDRESS_ACTION.setDefaultShipping(addressId)],
      'successful',
      isNotified,
    );
  };

  const editPersonal = async (
    personal: PersonalFields,
  ): Promise<Customer | void> => {
    setIsLoading(true);
    setError(null);
    const request: CustomerUpdateAction[] = [
      PERSONAL_DATA_ACTION.changeEmail(personal.email),
      PERSONAL_DATA_ACTION.setFirstName(personal.firstName),
      PERSONAL_DATA_ACTION.setLastName(personal.lastName),
      PERSONAL_DATA_ACTION.setDateOfBirth(personal.dateOfBirth),
    ];

    return updateAction(request, 'Personal data changed!');
  };

  return {
    changePassword,
    isLoading,
    error,
    resetError,
    editAddress,
    editPersonal,
    createAddress,
    deleteAddress,
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
