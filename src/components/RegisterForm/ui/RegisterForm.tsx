import { Checkbox, Form } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { NavLink } from 'react-router';

import {
  REGISTER_SCHEMA,
  TRegisterFieldsSchema,
  prepareData,
  useSomeAddresses,
} from '../lib/utils';

import styles from './Register.module.scss';
import { AddressFields, DefaultAddress } from './Address';
import { RegisterButton } from './RegisterButton';
import { PersonalInfo } from './PersonalInfo';

import useRegister from '@/shared/model/useRegister';
import { AppRoute } from '@/routes/appRoutes';

type RegisterFormProps = {
  step?: 'user' | 'shipping' | 'billing' | null;
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
            <PersonalInfo
              control={control}
              errors={errors}
              register={register}
              title="New user"
            />
          </div>
        )}
        {(step === 'shipping' || !step) && (
          <div className={styles.shipping}>
            <AddressFields
              control={control}
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
              control={control}
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
