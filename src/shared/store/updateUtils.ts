import {
  BaseAddress,
  MyCustomerAddAddressAction,
  MyCustomerChangeAddressAction,
  MyCustomerChangeEmailAction,
  MyCustomerRemoveAddressAction,
  MyCustomerSetDateOfBirthAction,
  MyCustomerSetDefaultBillingAddressAction,
  MyCustomerSetDefaultShippingAddressAction,
  MyCustomerAddShippingAddressIdAction,
  MyCustomerAddBillingAddressIdAction,
  MyCustomerSetFirstNameAction,
  MyCustomerSetLastNameAction,
  MyCustomerRemoveShippingAddressIdAction,
  MyCustomerRemoveBillingAddressIdAction,
} from '@commercetools/platform-sdk';
import { DateValue } from '@heroui/react';

// #region personal

export const PERSONAL_DATA_ACTION = {
  changeEmail: (email: string): MyCustomerChangeEmailAction => ({
    action: 'changeEmail',
    email,
  }),
  setFirstName: (firstName: string): MyCustomerSetFirstNameAction => ({
    action: 'setFirstName',
    firstName,
  }),
  setLastName: (lastName: string): MyCustomerSetLastNameAction => ({
    action: 'setLastName',
    lastName,
  }),
  setDateOfBirth: (dateOfBirth: DateValue): MyCustomerSetDateOfBirthAction => ({
    action: 'setDateOfBirth',
    dateOfBirth: dateOfBirth.toString(),
  }),
};

//#endregion personal

//#region address

export const ADDRESS_ACTION = {
  change: (
    addressId: string,
    changes: BaseAddress,
  ): MyCustomerChangeAddressAction => ({
    action: 'changeAddress',
    addressId,
    address: changes,
  }),
  remove: (addressId: string): MyCustomerRemoveAddressAction => ({
    action: 'removeAddress',
    addressId,
  }),
  add: (address: BaseAddress): MyCustomerAddAddressAction => ({
    action: 'addAddress',
    address,
  }),
  setDefaultShipping: (
    addressId: string,
  ): MyCustomerSetDefaultShippingAddressAction => ({
    action: 'setDefaultShippingAddress',
    addressId: addressId,
  }),
  setDefaultBilling: (
    addressId: string,
  ): MyCustomerSetDefaultBillingAddressAction => ({
    action: 'setDefaultBillingAddress',
    addressId: addressId,
  }),
  setShipping: (addressId: string): MyCustomerAddShippingAddressIdAction => ({
    action: 'addShippingAddressId',
    addressId: addressId,
  }),
  setBilling: (addressId: string): MyCustomerAddBillingAddressIdAction => ({
    action: 'addBillingAddressId',
    addressId: addressId,
  }),

  unsetDefaultShipping: (): MyCustomerSetDefaultShippingAddressAction => ({
    action: 'setDefaultShippingAddress',
    addressId: undefined,
  }),
  unsetDefaultBilling: (): MyCustomerSetDefaultBillingAddressAction => ({
    action: 'setDefaultBillingAddress',
    addressId: undefined,
  }),
  unsetShipping: (
    addressId: string,
  ): MyCustomerRemoveShippingAddressIdAction => ({
    action: 'removeShippingAddressId',
    addressId: addressId,
  }),
  unsetBilling: (
    addressId: string,
  ): MyCustomerRemoveBillingAddressIdAction => ({
    action: 'removeBillingAddressId',
    addressId: addressId,
  }),
};

//#endregion address
