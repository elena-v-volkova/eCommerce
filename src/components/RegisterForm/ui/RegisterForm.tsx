import { DateInput } from '@heroui/date-input';
import { Button, Form, Input, Select, SelectItem } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { getLocalTimeZone, today } from '@internationalized/date';
import { Controller, useForm } from 'react-hook-form';
import { I18nProvider } from '@react-aria/i18n';
import React from 'react';

import { REGISTER_SCHEMA, TRegisterFieldsSchema } from '../lib/registerSchema';

import styles from './Register.module.scss';

import { EyeFilledIcon, EyeSlashFilledIcon } from '@/components/Icons';
import { COUNTRIES, getCountryInfo } from '@/shared/store/countries';
import { prepareData } from '@/commercetools/register';
import useRegister from '@/shared/model/useRegister';

export const RegisterForm = () => {
  const {
    control,
    register,
    trigger,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegisterFieldsSchema>({
    resolver: zodResolver(REGISTER_SCHEMA),
    mode: 'onChange',
  });
  const { createCustomer, isLoading, error } = useRegister();
  const onSubmit = async (data: TRegisterFieldsSchema) => {
    const result = JSON.parse(JSON.stringify(data));

    result.dateOfBirth = `${data.dateOfBirth.year}-${String(data.dateOfBirth.month).padStart(2, '0')}-${String(data.dateOfBirth.day).padStart(2, '0')}`;
    result.address.country = getCountryInfo(data.address.country)?.code;
    createCustomer(prepareData(result));
  };
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className={styles.register}>
      <Form
        className="grid size-full grid-cols-2   justify-items-center gap-4 grid-rows-[350px_auto]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-start-2 row-start-1 flex w-full flex-col justify-end">
          <h4>New user</h4>
          <Input
            label="Email"
            labelPlacement="outside"
            type="email"
            {...register('email')}
            errorMessage={errors.email?.message}
            isInvalid={errors.email?.message ? true : false}
          />
          <Input
            label="Password"
            labelPlacement="outside"
            type={isVisible ? 'text' : 'password'}
            {...register('password')}
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
                ) : (
                  <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
                )}
              </button>
            }
            errorMessage={errors.password?.message}
            isInvalid={errors.password?.message ? true : false}
          />
          <Input
            label="First name"
            labelPlacement="outside"
            type="text"
            {...register('firstName')}
            errorMessage={errors.firstName?.message}
            isInvalid={errors.firstName?.message ? true : false}
          />
          <Input
            label="Last name"
            labelPlacement="outside"
            type="text"
            {...register('lastName')}
            errorMessage={errors.lastName?.message}
            isInvalid={errors.lastName?.message ? true : false}
          />

          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field }) => (
              <I18nProvider locale="en-GB">
                <DateInput
                  {...register('lastName')}
                  errorMessage={errors.dateOfBirth?.message}
                  isInvalid={!!errors.dateOfBirth}
                  label="Date of birth"
                  labelPlacement="outside"
                  placeholderValue={today(getLocalTimeZone())}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                />
              </I18nProvider>
            )}
          />
        </div>

        <div className="col-start-1 row-start-1 flex w-full flex-col justify-end">
          <h4 className="mb-2.5">Shipping address</h4>
          <Select
            className="py-0"
            placeholder="Select Country"
            {...register('address.country')}
            errorMessage={errors.address?.country?.message}
            isInvalid={errors.address?.country?.message ? true : false}
            onChange={(e) => {
              const value = e.target.value;

              setValue('address.country', value);
              trigger('address.postalCode');
            }}
          >
            {COUNTRIES.map((country) => (
              <SelectItem key={country}>{country}</SelectItem>
            ))}
          </Select>
          <Input
            label="Enter street"
            labelPlacement="outside"
            type="text"
            {...register('address.streetName')}
            errorMessage={errors.address?.streetName?.message}
            isInvalid={errors.address?.streetName?.message ? true : false}
          />
          <Input
            label="Enter city"
            labelPlacement="outside"
            {...register('address.city')}
            errorMessage={errors.address?.city?.message}
            isInvalid={errors.address?.city?.message ? true : false}
          />
          <Input
            label="Postal code"
            labelPlacement="outside"
            type="text"
            {...register('address.postalCode')}
            errorMessage={errors.address?.postalCode?.message}
            isInvalid={errors.address?.postalCode?.message ? true : false}
          />
        </div>

        <Button
          className="col-span-2 col-start-1 row-start-2"
          color="primary"
          isLoading={isLoading}
          type="submit"
        >
          Submit
        </Button>
        {error && (
          <p className="text-sm text-red-500 col-start-1 col-span-2 ">
            {error}
          </p>
        )}
      </Form>
    </div>
  );
};
