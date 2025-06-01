import { Customer } from '@commercetools/platform-sdk';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseDate } from '@internationalized/date';
import { useState } from 'react';
import { useDisclosure } from '@heroui/react';

import { ProfileModal } from './Modal';
import { EditableCard } from './EditableCard';

import { CustomerSettings } from '@/shared/store/customerProfile';
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

export type PersonalFields = Pick<
  TRegisterFieldsSchema,
  'email' | 'firstName' | 'lastName' | 'dateOfBirth' | 'password'
>;

export function PersonalContent({ customer }: { customer: Customer | null }) {
  const {
    reset,
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
      password: undefined,
    },
  });

  const [mode, setMode] = useState(false);

  const { isLoading, error, resetError, editPersonal } = CustomerSettings();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const onSubmit = (data: PersonalFields) => {
    if (Object.keys(errors).length === 0) {
      try {
        // editPersonal();
        setMode(false);
        console.log(data);
      } catch {
        onOpen();
      }
    }
  };
  const handleClose = () => {
    resetError();
    onOpenChange();
  };

  return (
    <EditableCard
      className="col-span-12 h-fit min-h-[410px] w-[320px] p-[20px] sm:col-span-4"
      headerClass="flex-col items-center p-0"
      noErrors={!Boolean(errors)}
      title="Your Information"
      onCancel={(value: boolean) => {
        setMode(!value);
        reset();
      }}
      onEdit={(value: boolean) => {
        setMode(!value);
      }}
      onSave={handleSubmit(onSubmit)}
    >
      {error && (
        <ProfileModal
          close={handleClose}
          errorMessage={error}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}
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
