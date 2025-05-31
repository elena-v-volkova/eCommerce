import { BaseAddress } from '@commercetools/platform-sdk';

interface UpdateAction {
  action: string;
  [key: string]: any;
}

type PersonalDataAction =
  | ChangeEmailAction
  | SetFirstNameAction
  | SetLastNameAction
  | SetDateOfBirthAction;
// #region personal
interface ChangeEmailAction {
  action: 'changeEmail';
  email: string;
}

interface SetFirstNameAction {
  action: 'setFirstName';
  firstName: string;
}

interface SetLastNameAction {
  action: 'setLastName';
  lastName: string;
}

interface SetDateOfBirthAction {
  action: 'setDateOfBirth';
  dateOfBirth: string;
}

export const PERSONAL_DATA_ACTION = {
  changeEmail: (email: string): ChangeEmailAction => ({
    action: 'changeEmail',
    email,
  }),
  setFirstName: (firstName: string): SetFirstNameAction => ({
    action: 'setFirstName',
    firstName,
  }),
  setLastName: (lastName: string): SetLastNameAction => ({
    action: 'setLastName',
    lastName,
  }),
  setDateOfBirth: (dateOfBirth: Date): SetDateOfBirthAction => ({
    action: 'setDateOfBirth',
    dateOfBirth: formatDateForAPI(dateOfBirth),
  }),
};
//#endregion personal

type AddressAction =
  | ChangeAddress
  | RemoveAddress
  | AddAddress
  | SetDefaultShippingAddress
  | SetDefaultBillingAddress;
//#region address

interface ChangeAddress {
  action: 'changeAddress';
  addressId: string;
  address: BaseAddress;
}
interface RemoveAddress {
  action: 'removeAddress';
  addressId: string;
}
interface AddAddress {
  action: 'addAddress';
  address: BaseAddress;
}
interface SetDefaultShippingAddress {
  action: 'setDefaultShippingAddress';
  addressId: string;
}
interface SetDefaultBillingAddress {
  action: 'setDefaultBillingAddress';
  addressId: string;
}

export const ADDRESS_ACTION = {
  change: (addressId: string, changes: BaseAddress): ChangeAddress => ({
    action: 'changeAddress',
    addressId,
    address: changes,
  }),
  remove: (addressId: string): RemoveAddress => ({
    action: 'removeAddress',
    addressId,
  }),
  add: (address: BaseAddress): AddAddress => ({
    action: 'addAddress',
    address,
  }),
  setDefaultShipping: (addressId: string): SetDefaultShippingAddress => ({
    action: 'setDefaultShippingAddress',
    addressId: addressId,
  }),
  setDefaultBilling: (addressId: string): SetDefaultBillingAddress => ({
    action: 'setDefaultBillingAddress',
    addressId: addressId,
  }),
};

function formatDateForAPI(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
//#endregion address
