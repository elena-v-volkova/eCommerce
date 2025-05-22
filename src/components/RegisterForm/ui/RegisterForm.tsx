import { DateInput } from '@heroui/date-input';
import { Checkbox, Form, Input } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { getLocalTimeZone, today } from '@internationalized/date';
import { Controller, useForm } from 'react-hook-form';
import { I18nProvider } from '@react-aria/i18n';
import { useEffect } from 'react';
import { NavLink } from 'react-router';
import { toast } from 'react-hot-toast';

import {
  REGISTER_SCHEMA,
  TRegisterFieldsSchema,
  prepareData,
  useSomeAddresses,
} from '../lib/utils';

import styles from './Register.module.scss';
import { AddressFields, DefaultAddress } from './Address';
import { RegisterButton } from './RegisterButton';

import useRegister from '@/shared/model/useRegister';
import { PasswordInput } from '@/components/PasswordInput';
import { AppRoute } from '@/routes/appRoutes';

type RegisterFormProps = {
  step?: 'user' | 'shipping' | 'billing' | 'register' | null;
  onDeliveryChange: (value: boolean) => void;
};

export const RegisterForm = ({ step, onDeliveryChange }: RegisterFormProps) => {
  const {
    control,
    register,
    trigger,
    setValue,
    handleSubmit,
    formState: { errors, isValidating },
    watch,
  } = useForm<TRegisterFieldsSchema>({
    resolver: zodResolver(REGISTER_SCHEMA),
    mode: 'onChange',
    defaultValues: {
      sameAsDelivery: true,
      defaultShipping: true,
      defaultBilling: true,
    },
  });
  const { createCustomer, isLoading, error } = useRegister();
  const onSubmit = async (data: TRegisterFieldsSchema) => {
    createCustomer(prepareData(data, sameAsDelivery));
    toast.success('Registration was successful!');
  };
  const sameAsDelivery = watch('sameAsDelivery');

  useSomeAddresses({ watch, setValue, control });
  useEffect(() => {
    onDeliveryChange(sameAsDelivery);
  }, [sameAsDelivery]);

  return (
    <div className={styles.register}>
      <Form
        className="grid size-auto grid-cols-[auto_320_320] grid-rows-[auto] justify-items-center gap-4"
        data-testid="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        {(step === 'user' || !step) && (
          <div className={styles.customer}>
            <h4 className="mb-2.5">New user</h4>
            <Input
              placeholder="Email"
              {...register('email')}
              errorMessage={errors.email?.message}
              isInvalid={errors.email?.message ? true : false}
            />
            <PasswordInput
              errorMessage={errors.password?.message}
              isInvalid={errors.password?.message ? true : false}
              register={register('password')}
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
        )}
        {(step === 'shipping' || !step) && (
          <div className={styles.shipping}>
            <AddressFields
              errors={errors}
              prefix="address"
              register={register}
              setValue={setValue}
              title="Shipping address"
              trigger={trigger}
            />
            <DefaultAddress
              className="mt-1"
              prefix={'defaultShipping'}
              register={register}
              text={'Default shipping address'}
            />
            {sameAsDelivery && (
              <DefaultAddress
                className="mt-1"
                prefix={'defaultBilling'}
                register={register}
                text={'Default billing address'}
              />
            )}
            <Checkbox
              className="my-1"
              color="default"
              {...register('sameAsDelivery')}
            >
              Billing and shipping address are the same
            </Checkbox>
            {sameAsDelivery && step && <RegisterButton isLoading={isLoading} />}
          </div>
        )}
        {(step === 'billing' || !step) && !sameAsDelivery && (
          <div className={styles.show_billing}>
            <AddressFields
              errors={errors}
              prefix="billingAddress"
              register={register}
              setValue={setValue}
              title="Billing address"
              trigger={trigger}
            />
            <DefaultAddress
              className="mt-1"
              prefix={'defaultBilling'}
              register={register}
              text={'Default billing address'}
            />
            {!sameAsDelivery && step && (
              <RegisterButton className="my-5" isLoading={isLoading} />
            )}
          </div>
        )}
        {!step && (
          <RegisterButton
            className="col-span-3 col-start-1 row-start-2 w-1/3"
            isLoading={isLoading}
          />
        )}
      </Form>
      {Object.keys(errors).length > 0 &&
        step &&
        !errors.address?.postalCode?.message &&
        !isValidating && <p className={styles.error_msg}>Заполните все поля</p>}
      {error && <p className={styles.error_msg}>{error}</p>}
      {(step === null || step === 'user') && (
        <div className="mt-4 text-center text-sm">
          Have an account?{' '}
          <NavLink
            className="underline underline-offset-4"
            to={`/${AppRoute.login}`}
          >
            Login
          </NavLink>
        </div>
      )}
    </div>
  );
};
