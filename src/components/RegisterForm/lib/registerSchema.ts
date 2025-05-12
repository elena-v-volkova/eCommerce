import { DateValue, getLocalTimeZone, today } from '@internationalized/date';
import { z } from 'zod';

import {
  COUNTRIES,
  CountryName,
  getCountryInfo,
} from '@/shared/store/countries';
const namePattern = z.string().regex(/^[A-Za-z]+$/, {
  message:
    'Must contain at least one character and no special characters or numbers',
});

let shippingCountry: CountryName | undefined;

const addressSchema = z.object({
  street: z
    .string()
    .min(1, { message: 'Street must contain at least one character' }),
  city: z
    .string()
    .min(1, { message: 'City must contain at least one character' })
    .regex(/^[A-Za-zА-Яа-яЁё\s-]+$/, {
      message: 'City must not contain numbers or special characters',
    }),
  postalCode: z.string().refine(
    (code) => {
      if (shippingCountry) {
        const isValid = getCountryInfo(shippingCountry)?.regex.test(code);

        return isValid || false;
      }

      return false;
    },
    {
      message: 'Postal code must be valid',
    },
  ),
  country: z.string().refine(
    (value) => {
      shippingCountry = value;

      return COUNTRIES.includes(value);
    },
    {
      message: 'Country must be from the predefined list',
    },
  ),
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
});

export type TRegisterFieldsSchema = z.infer<typeof REGISTER_SCHEMA>;
