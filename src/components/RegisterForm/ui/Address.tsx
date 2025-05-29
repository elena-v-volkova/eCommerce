import { Checkbox, Input, Select, SelectItem } from '@heroui/react';
import { UseFormRegister } from 'react-hook-form';

import { TRegisterFieldsSchema } from '../lib/utils';

import { COUNTRIES } from '@/shared/store/countries';
import { AddressFieldsProps } from '@/types';

type AddressFields = AddressFieldsProps<Pick<TRegisterFieldsSchema, 'address'>>;

export const AddressFields = ({
  title,
  prefix,
  register,
  errors,
  setValue,
  trigger,
  disabled = false,
  newAddress = true,
}: AddressFieldsProps<AddressFields>) => {
  return (
    <>
      <h4 className="mb-2.5">{title}</h4>
      <Select
        aria-label={`${prefix} country`}
        className="py-0"
        placeholder="Select Country"
        {...register(`${prefix}.country`)}
        errorMessage={errors[prefix]?.country?.message}
        isDisabled={disabled}
        isInvalid={errors[prefix]?.country?.message ? true : false}
        onChange={(e) => {
          const value = e.target.value;

          setValue(`${prefix}.country`, value);
          trigger(`${prefix}.postalCode`);
          trigger(`${prefix}.country`);
        }}
      >
        {COUNTRIES.map((country) => (
          <SelectItem key={country}>{country}</SelectItem>
        ))}
      </Select>

      <Input
        label={!newAddress ? 'City' : 'Enter city'}
        labelPlacement="outside"
        {...register(`${prefix}.city`)}
        errorMessage={errors[prefix]?.city?.message}
        isDisabled={disabled}
        isInvalid={errors[prefix]?.city?.message ? true : false}
      />

      <Input
        label={!newAddress ? 'Street' : 'Enter street'}
        labelPlacement="outside"
        type="text"
        {...register(`${prefix}.streetName`)}
        errorMessage={errors[prefix]?.streetName?.message}
        isDisabled={disabled}
        isInvalid={errors[prefix]?.streetName?.message ? true : false}
      />

      <Input
        label="Postal code"
        labelPlacement="outside"
        type="text"
        {...register(`${prefix}.postalCode`)}
        errorMessage={errors[prefix]?.postalCode?.message}
        isDisabled={disabled}
        isInvalid={errors[prefix]?.postalCode?.message ? true : false}
      />
    </>
  );
};

interface DefaultAddressProps {
  text: string;
  prefix: 'defaultShipping' | 'defaultBilling';
  register: UseFormRegister<TRegisterFieldsSchema>;
  className: string;
}

export const DefaultAddress: React.FC<DefaultAddressProps> = ({
  text,
  prefix,
  register,
  className,
}) => {
  return (
    <Checkbox
      disableAnimation
      className={className}
      color="warning"
      {...register(prefix)}
    >
      {text}
    </Checkbox>
  );
};
