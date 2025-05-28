import { DateInput } from '@heroui/date-input';
import { today, getLocalTimeZone } from '@internationalized/date';
import { I18nProvider } from '@react-aria/i18n';
import { Controller } from 'react-hook-form';
import { Input } from '@heroui/input';

import { TRegisterFieldsSchema } from '../lib/utils';

import { PasswordInput } from '@/components/PasswordInput';
import { FormFieldsProps } from '@/types';

export function PersonalInfo({
  title,
  register,
  errors,
  control,
}: Pick<
  FormFieldsProps<TRegisterFieldsSchema>,
  'title' | 'register' | 'errors' | 'control'
>) {
  return (
    <>
      <h4 className="mb-2.5">{title}</h4>
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
    </>
  );
}
