import { DateValue, getLocalTimeZone, today } from '@internationalized/date';
import { z } from 'zod';
import { CustomerDraft } from '@commercetools/platform-sdk';

import { COUNTRIES, getCountryInfo } from '@/shared/store/countries';
const namePattern = z.string().regex(/^[A-ZА-Яа-яa-z]+$/, {
  message:
    'Must contain at least one character and no special characters or numbers',
});

const addressSchema = z
  .object({
    streetName: z
      .string()
      .min(1, { message: 'Street must contain at least one character' }),
    city: z
      .string()
      .min(1, { message: 'City must contain at least one character' })
      .regex(/^[A-Za-zА-Яа-яЁё\s-]+$/, {
        message: 'City must not contain numbers or special characters',
      }),
    postalCode: z.string(),
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
    .min(8, 'Minimum 8 characters')
    .max(20, { message: 'Password is too long' })
    .regex(/[a-z]/, { message: 'Must contain a lowercase letter' })
    .regex(/[A-Z]/, { message: 'Must at least 1 uppercase letter,' })
    .regex(/[0-9]/, { message: 'Must contain a number' }),
  address: addressSchema,
  billingAddress: addressSchema,
});

export type TRegisterFieldsSchema = z.infer<typeof REGISTER_SCHEMA>;

export function prepareData(
  input: TRegisterFieldsSchema,
  sameAddress: boolean,
): CustomerDraft {
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

  return {
    email: draft.email,
    password: draft.password,
    firstName: draft.firstName,
    lastName: draft.lastName,
    dateOfBirth: draft.dateOfBirth.toString(),
    addresses: [address, billingAddress],
    defaultShippingAddress: 0,
    defaultBillingAddress: Number(!sameAddress),
  };
}
