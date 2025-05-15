import { Input, Select, SelectItem } from '@heroui/react';

import { TRegisterFieldsSchema } from '../lib/utils';

import { COUNTRIES } from '@/shared/store/countries';
import { AddressFieldsProps } from '@/types';

export const AddressFields = ({
  title,
  prefix,
  register,
  errors,
  setValue,
  trigger,
}: AddressFieldsProps<TRegisterFieldsSchema>) => {
  return (
    <>
      <h4 className="mb-2.5">{title}</h4>
      <Select
        aria-label={`${prefix} country`}
        className="py-0"
        placeholder="Select Country"
        {...register(`${prefix}.country`)}
        errorMessage={errors[prefix]?.country?.message}
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
        label="Enter city"
        labelPlacement="outside"
        {...register(`${prefix}.city`)}
        errorMessage={errors[prefix]?.city?.message}
        isInvalid={errors[prefix]?.city?.message ? true : false}
      />

      <Input
        label="Enter street"
        labelPlacement="outside"
        type="text"
        {...register(`${prefix}.streetName`)}
        errorMessage={errors[prefix]?.streetName?.message}
        isInvalid={errors[prefix]?.streetName?.message ? true : false}
      />

      <Input
        label="Postal code"
        labelPlacement="outside"
        type="text"
        {...register(`${prefix}.postalCode`)}
        errorMessage={errors[prefix]?.postalCode?.message}
        isInvalid={errors[prefix]?.postalCode?.message ? true : false}
      />
    </>
  );
};
