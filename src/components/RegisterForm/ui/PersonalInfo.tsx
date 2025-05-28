import { DateInput } from '@heroui/date-input';
import { today, getLocalTimeZone } from '@internationalized/date';
import { I18nProvider } from '@react-aria/i18n';
import { Controller } from 'react-hook-form';
import { Input } from '@heroui/input';
import { Customer } from '@commercetools/platform-sdk';

import { TRegisterFieldsSchema } from '../lib/utils';

import { PasswordInput } from '@/components/PasswordInput';
import { FormFieldsProps } from '@/types';

interface AdditionalProps {
  personalProps: {
    user: Customer | null;
    editMode: boolean;
    showPassword: boolean;
  };
}

type PersonalInfoProps = Pick<
  FormFieldsProps<TRegisterFieldsSchema>,
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
    editMode: false,
    showPassword: true,
  },
}: PersonalInfoProps) {
  return (
    <>
      <h4 className="mb-2.5">{title}</h4>
      <Input
        label={personalProps?.user ? 'Email' : undefined}
        labelPlacement="outside"
        placeholder="Email"
        {...register('email')}
        errorMessage={errors.email?.message}
        isInvalid={errors.email?.message ? true : false}
        isReadOnly={Boolean(personalProps?.editMode)}
      />
      {Boolean(personalProps?.showPassword) && (
        <PasswordInput
          errorMessage={errors.password?.message}
          isInvalid={errors.password?.message ? true : false}
          register={register('password')}
        />
      )}
      <Input
        label="First name"
        labelPlacement="outside"
        type="text"
        {...register('firstName')}
        errorMessage={errors.firstName?.message}
        isInvalid={errors.firstName?.message ? true : false}
        isReadOnly={Boolean(personalProps?.editMode)}
      />
      <Input
        label="Last name"
        labelPlacement="outside"
        type="text"
        {...register('lastName')}
        errorMessage={errors.lastName?.message}
        isInvalid={errors.lastName?.message ? true : false}
        isReadOnly={Boolean(personalProps?.editMode)}
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
              isReadOnly={Boolean(personalProps?.editMode)}
              label="Date of birth"
              labelPlacement="outside"
              placeholderValue={today(getLocalTimeZone())}
              value={field.value}
              onChange={field.onChange}
            />
          </I18nProvider>
        )}
      />
    </>
  );
}
