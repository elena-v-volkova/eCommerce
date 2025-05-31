import { Checkbox, Input, Select, SelectItem } from '@heroui/react';
import { Controller, UseFormRegister } from 'react-hook-form';

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
  control,
}: AddressFieldsProps<AddressFields>) => {
  return (
    <>
      <h4 className="mb-2.5">{title}</h4>
      <Controller
        control={control}
        name={`${prefix}.country`}
        render={({ field, fieldState }) => {
          const { ref: registerRef, ...registerProps } = register(
            `${prefix}.country`,
          );
          const selectProps = {
            ...registerProps,
            ...field,
            ref: (e: HTMLSelectElement | null) => {
              registerRef(e);
              field.ref(e);
            },
          };

          return (
            <Select
              {...selectProps}
              aria-label={`${prefix} country`}
              className="py-0"
              errorMessage={fieldState.error?.message}
              isDisabled={disabled}
              isInvalid={!!fieldState.error}
              placeholder="Select Country"
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;

                field.onChange(value);
                trigger(`${prefix}.postalCode`);
              }}
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
          );
        }}
      />
      <Controller
        control={control}
        name={`${prefix}.city`}
        render={({ field }) => (
          <Input
            label={!newAddress ? 'City' : 'Enter city'}
            labelPlacement="outside"
            {...register(`${prefix}.city`)}
            errorMessage={errors[prefix]?.city?.message}
            isDisabled={disabled}
            isInvalid={errors[prefix]?.city?.message ? true : false}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name={`${prefix}.streetName`}
        render={({ field }) => (
          <Input
            label={!newAddress ? 'Street' : 'Enter street'}
            labelPlacement="outside"
            type="text"
            {...register(`${prefix}.streetName`)}
            errorMessage={errors[prefix]?.streetName?.message}
            isDisabled={disabled}
            isInvalid={errors[prefix]?.streetName?.message ? true : false}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name={`${prefix}.postalCode`}
        render={({ field }) => (
          <Input
            label="Postal code"
            labelPlacement="outside"
            type="text"
            {...register(`${prefix}.postalCode`)}
            errorMessage={errors[prefix]?.postalCode?.message}
            isDisabled={disabled}
            isInvalid={errors[prefix]?.postalCode?.message ? true : false}
            {...field}
          />
        )}
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
