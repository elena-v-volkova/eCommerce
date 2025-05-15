import { DateInput } from '@heroui/date-input';
import { Button, Checkbox, Form, Input } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { getLocalTimeZone, today } from '@internationalized/date';
import { Controller, useForm } from 'react-hook-form';
import { I18nProvider } from '@react-aria/i18n';
import React, { useEffect, useState } from 'react';

import {
  REGISTER_SCHEMA,
  TRegisterFieldsSchema,
  prepareData,
} from '../lib/registerSchema';

import styles from './Register.module.scss';
import { AddressFields } from './Address';

import { EyeFilledIcon, EyeSlashFilledIcon } from '@/components/Icons';
import useRegister from '@/shared/model/useRegister';

export const RegisterForm = () => {
  const {
    control,
    register,
    trigger,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TRegisterFieldsSchema>({
    resolver: zodResolver(REGISTER_SCHEMA),
    mode: 'onChange',
    defaultValues: {
      sameAsDelivery: true,
    },
  });
  const { createCustomer, isLoading, error } = useRegister();
  const onSubmit = async (data: TRegisterFieldsSchema) => {
    createCustomer(prepareData(data, sameAsDelivery));
  };
  const [isVisible, setIsVisible] = React.useState(false);
  const sameAsDelivery = watch('sameAsDelivery');
  const address = watch('address');

  const [changed, setChanged] = useState<boolean>(false);

  watch((data, { name }) => {
    if (data.sameAsDelivery) {
      if (name?.startsWith('address', 0)) {
        setChanged(!changed);
      }
    }
  });

  useEffect(() => {
    if (sameAsDelivery) {
      setValue('billingAddress', address);
    }
  }, [sameAsDelivery, changed]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className={styles.register}>
      <Form
        className="grid size-auto grid-cols-[auto_320_320] grid-rows-[auto] justify-items-center gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={styles.customer}>
          <h4 className="mb-2.5">New user</h4>
          <Input
            placeholder="Email"
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
                  {...register('dateOfBirth')}
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

        <div className={styles.shipping}>
          <AddressFields
            errors={errors}
            prefix="address"
            register={register}
            setValue={setValue}
            title="Shipping address"
            trigger={trigger}
          />
          <Checkbox
            className="m-1"
            color="default"
            {...register('sameAsDelivery')}
          >
            Billing and shipping address are the same?
          </Checkbox>
        </div>

        {!sameAsDelivery && (
          <div className={styles.show_billing}>
            <AddressFields
              errors={errors}
              prefix="billingAddress"
              register={register}
              setValue={setValue}
              title="Billing address"
              trigger={trigger}
            />
          </div>
        )}

        <Button
          className="col-span-3 col-start-1 row-start-2"
          color="primary"
          isLoading={isLoading}
          type="submit"
        >
          Submit
        </Button>
      </Form>
      {error && <p className={styles.error_msg}>{error}</p>}
    </div>
  );
};
