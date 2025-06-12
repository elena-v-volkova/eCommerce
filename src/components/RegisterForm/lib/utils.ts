import { DateValue, getLocalTimeZone, today } from '@internationalized/date';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import {
  UseFormWatch,
  UseFormSetValue,
  useWatch,
  Control,
} from 'react-hook-form';

import { BaseAddress, MyCustomerDraft } from '@/types/commercetools';
import { COUNTRIES, getCountryInfo } from '@/shared/store/countries';
const namePattern = z
  .string()
  .regex(/^(?:\S(?:.*\S)?)?$/, { message: 'No leading or trailing spaces' })
  .regex(/^[A-ZА-Яа-яЁёa-z]+$/, {
    message:
      'Must contain at least one character and no special characters or numbers',
  });

const addressSchema = z
  .object({
    streetName: z
      .string()
      .regex(/^(?:\S(?:.*\S)?)?$/, { message: 'No leading or trailing spaces' })
      .min(1, { message: 'Street must contain at least one character' }),
    city: z
      .string()
      .regex(/^(?:\S(?:.*\S)?)?$/, { message: 'No leading or trailing spaces' })
      .min(1, { message: 'City must contain at least one character' })
      .regex(/^[A-Za-zА-Яа-яЁё\s-]+$/, {
        message: 'City must not contain numbers or special characters',
      }),
    postalCode: z
      .string()
      .regex(/^(?:\S(?:.*\S)?)?$/, { message: 'No leading or trailing spaces' })
      .refine((value: string) => value === '' || !value.startsWith('0'), {
        message: 'Should not start with zero',
      }),
    country: z.string().refine(
      (value) => {
        return COUNTRIES.includes(value);
      },
      {
        message: 'Country must be from the predefined list',
      },
    ),
  })
  .superRefine(({ postalCode, country }, ctx) => {
    if (!country) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['postalCode'],
        message: 'Please select a country first',
      });

      return;
    }
    const rule = getCountryInfo(country)?.regex;

    if (rule !== undefined) {
      const isValid = rule.test(postalCode);
      const isSpacesAllowed = /\s/.test(rule.source);

      if (!isSpacesAllowed && postalCode.includes(' ')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['postalCode'],
          message: 'No spaces allowed',
        });
      }
      if (!isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['postalCode'],
          message: 'Postal code must be valid for the selected country',
        });
      }
    }
  });

export const REGISTER_SCHEMA = z.object({
  lastName: namePattern,
  firstName: namePattern,
  dateOfBirth: z
    .custom<DateValue>((value) => value instanceof Object, {
      message: 'Please select a valid date',
    })
    .refine(
      (date) => {
        return date.compare(today(getLocalTimeZone())) <= 0;
      },
      { message: 'Date of birth cannot be in the future' },
    )
    .refine(
      (date) => {
        const minAdultDate = today(getLocalTimeZone()).subtract({ years: 18 });

        return date.compare(minAdultDate) <= 0;
      },
      { message: 'You must be at least 18 years old' },
    ),

  email: z
    .string()
    .refine((val) => val === val.trim(), {
      message: 'Email must not have leading or trailing spaces',
    })
    .refine((val) => !val.includes(' '), {
      message: 'Email must not contain spaces',
    })
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'Must be a valid email (e.g., user@example.com)',
    }),

  password: z
    .string()
    .regex(/^(?:[^\s\t]+)?$/, { message: 'No spaces allowed' })
    .min(8, 'Minimum 8 characters')
    .max(20, { message: 'Password is too long' })
    .regex(/[a-z]/, { message: 'Must contain a lowercase letter' })
    .regex(/[A-Z]/, { message: 'Must at least 1 uppercase letter,' })
    .regex(/[0-9]/, { message: 'Must contain a number' })
    .optional(),
  address: addressSchema,
  billingAddress: addressSchema,
  sameAsDelivery: z.boolean(),
  defaultShipping: z.boolean(),
  defaultBilling: z.boolean(),
});

export type TRegisterFieldsSchema = z.infer<typeof REGISTER_SCHEMA>;

interface UseSyncAddressesParams {
  watch: UseFormWatch<TRegisterFieldsSchema>;
  setValue: UseFormSetValue<TRegisterFieldsSchema>;
  control: Control<TRegisterFieldsSchema>;
}

export function useSomeAddresses({
  watch,
  setValue,
  control,
}: UseSyncAddressesParams) {
  const isSame = useWatch({ control, name: 'sameAsDelivery' });
  const address = useWatch({ control, name: 'address' });
  const [isChanged, setChanged] = useState(false);

  watch((data, { name }) => {
    if (data.sameAsDelivery) {
      if (name?.startsWith('address', 0)) {
        setChanged(!isChanged);
      }
    }
  });
  useEffect(() => {
    if (isSame && addressIsValid(address)) {
      setValue('billingAddress', address);
    }
  }, [isSame, isChanged]);
}

function addressIsValid(value: unknown): value is BaseAddress {
  return (
    typeof value === 'object' &&
    value !== null &&
    'streetName' in value &&
    'city' in value &&
    'postalCode' in value &&
    'country' in value
  );
}

export function prepareData(
  input: TRegisterFieldsSchema,
  sameAddress: boolean,
): MyCustomerDraft {
  const draft = JSON.parse(JSON.stringify(input));

  draft.dateOfBirth = input.dateOfBirth.toString();
  draft.address.country = getCountryInfo(input.address.country)?.code;
  draft.billingAddress.country = getCountryInfo(
    input.billingAddress.country,
  )?.code;

  const address = {
    ...draft.address,
    firstName: draft.firstName,
    lastName: draft.lastName,
  };
  const billingAddress = {
    ...draft.billingAddress,
    firstName: draft.firstName,
    lastName: draft.lastName,
  };
  const arrayAddr = [];

  sameAddress
    ? arrayAddr.push(address)
    : arrayAddr.push(address, billingAddress);

  const result = {
    email: draft.email,
    password: draft.password,
    firstName: draft.firstName,
    lastName: draft.lastName,
    dateOfBirth: draft.dateOfBirth.toString(),
    addresses: arrayAddr,
  };

  if (draft.defaultShipping)
    Object.defineProperty(result, 'defaultShippingAddress', {
      value: 0,
      enumerable: true,
    });
  if (draft.defaultBilling)
    Object.defineProperty(result, 'defaultBillingAddress', {
      value: (() => {
        return sameAddress ? 0 : 1;
      })(),
      enumerable: true,
    });

  return result;
}
