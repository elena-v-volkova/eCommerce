import {
  BaseAddress,
  MyCustomerAddAddressAction,
  MyCustomerChangeAddressAction,
  MyCustomerChangeEmailAction,
  MyCustomerRemoveAddressAction,
  MyCustomerSetDateOfBirthAction,
  MyCustomerSetDefaultBillingAddressAction,
  MyCustomerSetDefaultShippingAddressAction,
  MyCustomerSetFirstNameAction,
  MyCustomerSetLastNameAction,
} from '@commercetools/platform-sdk';
import { DateValue } from '@heroui/react';

// #region personal
export type ActionsUpdate =
  | MyCustomerAddAddressAction
  | MyCustomerChangeAddressAction
  | MyCustomerChangeEmailAction
  | MyCustomerRemoveAddressAction
  | MyCustomerSetDateOfBirthAction
  | MyCustomerSetDefaultBillingAddressAction
  | MyCustomerSetDefaultShippingAddressAction
  | MyCustomerSetFirstNameAction
  | MyCustomerSetLastNameAction;

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
    dateOfBirth: dateOfBirth.toString(), //formatDateForAPI(dateOfBirth),
  }),
};

// function formatDateForAPI(date: DateValue): string {
//   const year = date.year;
//   const month = String(date.month + 1).padStart(2, '0');
//   const day = String(date.day).padStart(2, '0');

//   return `${year}-${month}-${day}`;
// }
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
};

//#endregion address
