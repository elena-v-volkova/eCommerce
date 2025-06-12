import {
  BaseAddress,
  ClientResponse,
  Customer,
  CustomerUpdateAction,
  InvalidCurrentPasswordError,
  MyCustomerChangePassword,
  ErrorResponse,
  ErrorObject,
} from '@commercetools/platform-sdk';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { useSession } from '../model/useSession';

import { getCountryInfo } from './countries';
import { ADDRESS_ACTION, PERSONAL_DATA_ACTION } from './updateUtils';

import { apiAnonRoot } from '@/commercetools/anonUser';
import { createPasswordFlowClient } from '@/commercetools/login';
import { PersonalFields } from '@/pages/Profile/PersonalContent';
import {
  AddressFields,
  ProfileAddressFields,
} from '@/pages/Profile/AddressContent';

function getVersion(): number {
  const stored = JSON.parse(localStorage.getItem('userData') || '') as Customer;

  return stored ? stored.version : 1;
}

export function CustomerSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser, user, setUser } = useSession();
  const [error, setError] = useState<string | null>(null);

  const resetError = (): void => {
    setError(null);
  };
  const updateLocalClient = (value: Customer) => {
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
      user ? user.email : '_',
      data.currentPassword,
    );

    setIsLoading(true);
    setError(null);
    if (!data) return;
    await passwordClient
      .me()
      .password()
      .post({
        body: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          version: user?.version || 1,
        },
      })
      .execute()
      .then(async (response: ClientResponse<Customer>) => {
        const customer = response.originalRequest;

        notifyToast('Password successful changed!');
        const newClient = createPasswordFlowClient(
          user ? user.email : '_',
          data.newPassword,
        );
        const { body: updatedCustomer } = await newClient.me().get().execute();

        updateLocalClient(updatedCustomer);

        return customer;
      })
      .catch((error: ErrorObject) => {
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
      .withId({ ID: user?.id || '1' })
      .post({
        body: {
          version: getVersion(),
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
      .catch((error: ErrorResponse) => {
        setError(error.message);
        throw new Error(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const prepareAddress = (
    address: BaseAddress | AddressFields,
  ): BaseAddress => {
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
    editedAddress: ProfileAddressFields,
  ): Promise<Customer | void> => {
    if (!addressId || !editedAddress) return;
    const request = ADDRESS_ACTION.change(
      addressId,
      prepareAddress(editedAddress.address),
    );

    if (editedAddress.shipping || editedAddress.billing) {
      await setAddressTypes(editedAddress, addressId);
      setIsLoading(false);
    }

    return updateAction([request], 'Address successful changed!');
  };

  const createAddress = async (
    newAddress: ProfileAddressFields,
  ): Promise<Customer | void> => {
    if (!newAddress) return;
    const address = JSON.parse(JSON.stringify(newAddress.address));

    const getIds = (user: Customer): string[] => {
      return user.addresses.reduce((reducer: string[], item: BaseAddress) => {
        reducer.push(item.id || '');

        return reducer;
      }, []);
    };
    const oldIds = getIds(user as Customer);
    const request = ADDRESS_ACTION.add(prepareAddress(address));

    return await updateAction([request], 'Address successful created!', false)
      .then(async (updated) => {
        if (updated) {
          const newId: string | undefined =
            getIds(updated)
              .filter((item) => !oldIds.includes(item))
              .pop()
              ?.toString() || '';

          const result = await setAddressTypes(newAddress, newId);

          if (result) {
            return result;
          }
        }

        return updated;
      })
      .then((data) => {
        notifyToast('Address successful created!');

        return data;
      })
      .catch();
  };

  const deleteAddress = async (addressId: string): Promise<Customer | void> => {
    if (!addressId) return;
    const request = ADDRESS_ACTION.remove(addressId);

    return updateAction([request], 'Address deleted!');
  };

  const setAddressTypes = async (
    addr: ProfileAddressFields,
    addressId: string,
  ): Promise<Customer | void> => {
    let actions = Array<CustomerUpdateAction>();
    const canNotify = false;

    if (addr.billing) {
      actions.push(ADDRESS_ACTION.setBilling(addressId));
      if (addr.defaultBilling) {
        actions.push(ADDRESS_ACTION.setDefaultBilling(addressId));
      }
    }
    if (addr.shipping) {
      actions.push(ADDRESS_ACTION.setShipping(addressId));
      if (addr.defaultShipping) {
        actions.push(ADDRESS_ACTION.setDefaultShipping(addressId));
      }
    }
    if (actions.length > 0) {
      return await updateAction(actions, 'Types address changed', canNotify);
    }

    return;
  };

  const unsetAddressTypes = async (
    initialValues: ProfileAddressFields,
    currentValues: ProfileAddressFields,
    addressId: string,
  ): Promise<Customer | void> => {
    let actions = Array<CustomerUpdateAction>();
    const canNotify = false;

    if (initialValues.defaultBilling && !currentValues.defaultBilling)
      actions.push(ADDRESS_ACTION.unsetDefaultBilling());
    if (initialValues.defaultShipping && !currentValues.defaultShipping)
      actions.push(ADDRESS_ACTION.unsetDefaultShipping());
    if (initialValues.shipping && !currentValues.shipping)
      actions.push(ADDRESS_ACTION.unsetShipping(addressId));
    if (initialValues.billing && !currentValues.billing)
      actions.push(ADDRESS_ACTION.unsetBilling(addressId));
    if (actions.length > 0) {
      return await updateAction(actions, 'Types address changed', canNotify);
    }

    return;
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

    return await updateAction(request, 'Personal data changed!');
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
    unsetAddressTypes,
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

// function isCustomer(obj: any): obj is Customer {
//   return (
//     obj !== null &&
//     typeof obj === 'object' &&
//     typeof obj.id === 'string' &&
//     typeof obj.version === 'number' &&
//     typeof obj.email === 'string' &&
//     Array.isArray(obj.addresses)
//   );
// }
