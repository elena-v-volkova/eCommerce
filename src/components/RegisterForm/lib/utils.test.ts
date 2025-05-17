// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { CalendarDate } from '@internationalized/date';

import { prepareData } from './utils';

describe('prepareData', () => {
  const baseInput: TRegisterFieldsSchemachema = {
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
  };

  it('should prepare correct CustomerDraft when sameAddress is false', () => {
    const result = prepareData(baseInput, false);

    expect(result.dateOfBirth).toBe('1990-05-09');
    expect(result.addresses[0].country).toBe('RU');
    expect(result.addresses[1].country).toBe('CA');
    expect(result.addresses[0].firstName).toBe('John');
    expect(result.defaultBillingAddress).toBe(1);
    expect(result.defaultShippingAddress).toBe(0);
  });

  it('should set defaultBillingAddress to 0 when sameAddress is true', () => {
    const result = prepareData(baseInput, true);

    expect(result.defaultBillingAddress).toBe(0);
  });
});
