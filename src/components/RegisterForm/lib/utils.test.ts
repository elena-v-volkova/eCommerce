// @ts-nocheck
import { CalendarDate } from '@internationalized/date';
import { describe, expect, it } from 'vitest';

import { prepareData, TRegisterFieldsSchema } from './utils';

const baseInput: TRegisterFieldsSchema = {
  email: 'test@example.com',
  password: '123456',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: new CalendarDate(1990, 5, 9),
  address: {
    country: 'Russia',
    city: 'Moscow',
    streetName: 'Lenina',
    postalCode: '123456',
  },
  billingAddress: {
    country: 'Canada',
    city: 'Toronto',
    streetName: 'King St',
    postalCode: 'A1A 1A1',
  },
  defaultShipping: true,
  defaultBilling: true,
};

describe('prepareData', () => {
  it('should prepare correct CustomerDraft when sameAddress is false', () => {
    const result = prepareData(baseInput, false);

    expect(result.dateOfBirth).toBe('1990-05-09');
    expect(result.addresses[0].country).toBe('RU');
    expect(result.addresses[1].country).toBe('CA');
    expect(result.addresses[0].firstName).toBe('John');
    expect(result.defaultBillingAddress).toBe(1);
    expect(result.defaultShippingAddress).toBe(0);
  });

  it('should set addresses size when sameAddress is true', () => {
    const result = prepareData(baseInput, true);

    expect(result.addresses.length).toBe(1);
  });

  it('should not parameters default billing and shipping addresses when no default addresses', () => {
    baseInput.defaultBilling = false;
    baseInput.defaultShipping = false;
    const result = prepareData(baseInput, false);

    expect(result.defaultBillingAddress).toBe(undefined);
    expect(result.defaultShippingAddress).toBe(undefined);
  });
});
