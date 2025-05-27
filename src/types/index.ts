import { TRegisterFieldsSchema } from '@/components/RegisterForm/lib/utils';
import { SVGProps } from 'react';
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormTrigger,
  Control,
} from 'react-hook-form';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface AddressFieldsProps<T extends TRegisterFieldsSchema>
  extends FormFieldsProps<T> {
  prefix: 'billingAddress' | 'address';
}

export interface FormFieldsProps<T extends TRegisterFieldsSchema> {
  title: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  setValue: UseFormSetValue<T>;
  trigger: UseFormTrigger<T>;
  control?: Control<T>;
}
