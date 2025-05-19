import { z } from 'zod';

export const LOGIN_SCHEMA = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
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
    .min(8, { message: 'Password is too short' })
    .max(20, { message: 'Password is too long' })
    .regex(/[a-z]/, { message: 'Must contain a lowercase letter' })
    .regex(/[A-Z]/, { message: 'Must contain an uppercase letter' })
    .regex(/[0-9]/, { message: 'Must contain a number' })
    .refine((val) => !val.startsWith(' ') && !val.endsWith(' '), {
      message: 'Password should not have leading or trailing spaces',
    }),
});

export type TLoginFieldsSchema = z.infer<typeof LOGIN_SCHEMA>;
