import { Customer } from '@commercetools/platform-sdk';

import { AddressType } from '@/types';

export function showAddressType(id: string, customer: Customer): AddressType {
  const isDefaultShipping = (customer.defaultShippingAddressId || '') === id;
  const isDefaultBilling = (customer.defaultBillingAddressId || '') === id;
  const isShipping = Boolean(customer.shippingAddressIds?.includes(id));
  const isBilling = Boolean(customer.billingAddressIds?.includes(id));

  let isDefault: boolean;
  let type: AddressType['type'];

  if (isDefaultShipping && isDefaultBilling) {
    isDefault = true;
    type = 'Default';
  } else if (isDefaultShipping) {
    isDefault = isDefaultShipping;
    type = 'Default shipping';
  } else {
    isDefault = isDefaultBilling;
    type = isDefaultBilling ? 'Default billing' : undefined;
  }

  if (isShipping && isBilling) {
    return {
      label: isDefault ? 'Shipping<br>& Billing' : 'Shipping & Billing',
      default: isDefault,
      type: type,
      billing: isBilling,
      defaultBilling: isDefaultBilling,
      shipping: isShipping,
      defaultShipping: isDefaultShipping,
    };
  }
  if (isShipping)
    return {
      label: !isDefault ? 'Shipping' : 'Address',
      default: isDefault,
      type: type,
      billing: isBilling,
      defaultBilling: isDefaultBilling,
      shipping: isShipping,
      defaultShipping: isDefaultShipping,
    };
  if (isBilling)
    return {
      label: !isDefault ? 'Billing' : 'Address',
      default: isDefault,
      type: type,
      billing: isBilling,
      defaultBilling: isDefaultBilling,
      shipping: isShipping,
      defaultShipping: isDefaultShipping,
    };

  return {
    label: 'Address',
    default: false,
    type: undefined,
    billing: false,
    defaultBilling: false,
    shipping: false,
    defaultShipping: false,
  };
}
