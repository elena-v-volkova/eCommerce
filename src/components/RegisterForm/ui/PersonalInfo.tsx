import { DateInput } from '@heroui/date-input';
import { today, getLocalTimeZone } from '@internationalized/date';
import { I18nProvider } from '@react-aria/i18n';
import { Controller } from 'react-hook-form';
import { Input } from '@heroui/input';
import { Customer } from '@commercetools/platform-sdk';
import { DateValue } from '@heroui/react';

import { PasswordInput } from '@/components/PasswordInput';
import { FormFieldsProps } from '@/types';

interface AdditionalProps {
  personalProps: {
    user: Customer | null;
    disabled: boolean;
    showPassword: boolean;
  };
}
type PersonalFields = {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: DateValue;
  password?: string;
};

type PersonalInfoProps = Pick<
  FormFieldsProps<PersonalFields>,
  'title' | 'register' | 'errors' | 'control'
> &
  Partial<AdditionalProps>;

export function PersonalInfo({
  title,
  register,
  errors,
  control,
  personalProps = {
    user: null,
    disabled: false,
    showPassword: true,
  },
}: PersonalInfoProps) {
  return (
    <>
      {title && <h4 className="mb-2.5">{title}</h4>}
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <Input
            label={personalProps?.user ? 'Email' : undefined}
            labelPlacement="outside"
            placeholder="Email"
            {...register('email')}
            errorMessage={errors.email?.message}
            isDisabled={personalProps?.disabled}
            isInvalid={!!errors.email?.message}
            {...field}
          />
        )}
      />
      {Boolean(personalProps?.showPassword) && (
        <PasswordInput
          errorMessage={errors.password?.message}
          isInvalid={!!errors.password?.message}
          register={register('password')}
        />
      )}
      <Controller
        control={control}
        name="firstName"
        render={({ field }) => (
          <Input
            label="First name"
            labelPlacement="outside"
            type="text"
            {...register('firstName')}
            errorMessage={errors.firstName?.message}
            isDisabled={personalProps?.disabled}
            isInvalid={!!errors.firstName?.message}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="lastName"
        render={({ field }) => (
          <Input
            label="Last name"
            labelPlacement="outside"
            type="text"
            {...register('lastName')}
            errorMessage={errors.lastName?.message}
            isDisabled={personalProps?.disabled}
            isInvalid={!!errors.lastName?.message}
            {...field}
          />
        )}
      />

      <Controller
        control={control}
        name="dateOfBirth"
        render={({ field }) => (
          <I18nProvider locale="en-GB">
            <DateInput
              {...register('dateOfBirth')}
              errorMessage={errors.dateOfBirth?.message}
              isDisabled={personalProps?.disabled}
              isInvalid={!!errors.dateOfBirth}
              label="Date of birth"
              labelPlacement="outside"
              placeholderValue={today(getLocalTimeZone())}
              value={field.value ? field.value : undefined}
              onChange={field.onChange}
            />
          </I18nProvider>
        )}
      />
    </>
  );
}
