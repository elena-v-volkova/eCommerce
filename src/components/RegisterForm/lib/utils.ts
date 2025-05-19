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
      .regex(/^(?!0)\S*$|^$/, { message: 'Should not start from zero' }),
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

    const isValid = getCountryInfo(country)?.regex.test(postalCode);

    if (!isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['postalCode'],
        message: 'Postal code must be valid for the selected country',
      });
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
    ),

  email: z.string().email(),

  password: z
    .string()
    .regex(/^(?:[^\s\t]+)?$/, { message: 'No spaces allowed' })
    .min(8, 'Minimum 8 characters')
    .max(20, { message: 'Password is too long' })
    .regex(/[a-z]/, { message: 'Must contain a lowercase letter' })
    .regex(/[A-Z]/, { message: 'Must at least 1 uppercase letter,' })
    .regex(/[0-9]/, { message: 'Must contain a number' }),
  address: addressSchema,
  billingAddress: addressSchema,
  sameAsDelivery: z.boolean(),
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
  const array = [];

  sameAddress ? array.push(address) : array.push(address, billingAddress);

  return {
    email: draft.email,
    password: draft.password,
    firstName: draft.firstName,
    lastName: draft.lastName,
    dateOfBirth: draft.dateOfBirth.toString(),
    addresses: array,
    defaultShippingAddress: 0,
    defaultBillingAddress: Number(!sameAddress),
  };
}
