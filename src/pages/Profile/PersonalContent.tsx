import { Customer } from '@commercetools/platform-sdk';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseDate } from '@internationalized/date';
import { useState } from 'react';

import { EditableCard } from './EditableCard';

import { PersonalInfo } from '@/components/RegisterForm/ui/PersonalInfo';
import {
  REGISTER_SCHEMA,
  TRegisterFieldsSchema,
} from '@/components/RegisterForm/lib/utils';

const PERSONAL_SCHEMA = REGISTER_SCHEMA.pick({
  email: true,
  firstName: true,
  lastName: true,
  dateOfBirth: true,
});

type PersonalFields = Pick<
  TRegisterFieldsSchema,
  'email' | 'firstName' | 'lastName' | 'dateOfBirth'
>;

export function PersonalContent({ customer }: { customer: Customer | null }) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalFields>({
    resolver: zodResolver(PERSONAL_SCHEMA),
    mode: 'onChange',
    defaultValues: {
      email: customer?.email,
      firstName: customer?.firstName,
      lastName: customer?.lastName,
      dateOfBirth: parseDate(customer?.dateOfBirth?.toString() || ''),
    },
  });
  const onSubmit = (data: PersonalFields) => {
    setMode(false);
    console.log(data);
  };
  const [mode, setMode] = useState(false);

  return (
    <EditableCard
      className="col-span-12 h-fit min-h-[410px] w-[320px] p-[20px] sm:col-span-4"
      headerClass="flex-col items-center p-0"
      title="Your Information"
      onCancel={(value) => {
        setMode(!value);
      }}
      onEdit={(value) => {
        setMode(!value);
      }}
      onSave={handleSubmit(onSubmit)}
    >
      <div
        className="grid size-auto grid-cols-[auto_320_320] grid-rows-[auto] justify-items-center gap-4"
        data-testid="form-personal-profile"
      >
        <PersonalInfo
          control={control}
          errors={errors}
          personalProps={{
            user: customer,
            disabled: !mode,
            showPassword: false,
          }}
          register={register}
        />
      </div>
    </EditableCard>
  );
}
