import { SVGProps } from 'react';
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormTrigger,
  Control,
  FieldValues,
} from 'react-hook-form';
import { AddressCheckBoxes } from '@/pages/Profile/AddressCheckBoxes';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface AddressFieldsProps<T extends FieldValues>
  extends FormFieldsProps<T> {
  prefix: 'billingAddress' | 'address';
  disabled?: boolean;
  newAddress?: boolean;
}

export interface FormFieldsProps<T extends FieldValues> {
  title?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  setValue: UseFormSetValue<T>;
  trigger: UseFormTrigger<T>;
  control?: Control<T>;
}

export type AddressType = {
  label:
    | 'Shipping'
    | 'Billing'
    | 'Shipping & Billing'
    | 'Shipping<br>& Billing'
    | 'Address'
    | 'NEW';
  default: boolean;
  type: 'Default billing' | 'Default shipping' | 'Default' | undefined;
} & AddressCheckBoxes;
