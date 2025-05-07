import { z } from 'zod';

export const LOGIN_SCHEMA = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password is too short')
    .max(20, { message: 'Password is too long' })
    .regex(/[a-z]/, { message: 'Must contain a lowercase letter' })
    .regex(/[A-Z]/, { message: 'Must contain an uppercase letter' })
    .regex(/[0-9]/, { message: 'Must contain a number' }),
});

export type TFormFiledsSchema = z.infer<typeof LOGIN_SCHEMA>;
