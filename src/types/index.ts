import { TRegisterFieldsSchema } from '@/components/RegisterForm/lib/registerSchema';
import { SVGProps } from 'react';
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface AddressFieldsProps<T extends TRegisterFieldsSchema> {
  title: string;
  prefix: 'billingAddress' | 'address';
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  setValue: UseFormSetValue<T>;
  trigger: UseFormTrigger<T>;
}
