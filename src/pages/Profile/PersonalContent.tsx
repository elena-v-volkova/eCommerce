import { Customer } from '@commercetools/platform-sdk';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseDate } from '@internationalized/date';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@heroui/react';

import { ProfileModal } from './Modal';
import { EditableCard } from './EditableCard';

import { CustomerSettings } from '@/shared/store/customerProfile';
import { PersonalInfo } from '@/components/RegisterForm/ui/PersonalInfo';
import {
  REGISTER_SCHEMA,
  TRegisterFieldsSchema,
} from '@/components/RegisterForm/lib/utils';
import { useSession } from '@/shared/model/useSession';

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

export function PersonalContent() {
  const { user } = useSession();
  const [customer, setCustomer] = useState<Customer | null>(user);

  const {
    reset,
    control,
    register,
    getValues,
    formState: { errors },
  } = useForm<PersonalFields>({
    resolver: zodResolver(PERSONAL_SCHEMA),
    mode: 'onChange',
    defaultValues: {
      email: customer?.email || undefined,
      firstName: customer?.firstName || undefined,
      lastName: customer?.lastName || undefined,
      dateOfBirth: customer?.dateOfBirth
        ? parseDate(customer.dateOfBirth)
        : undefined,
      password: undefined,
    },
  });

  useEffect(() => {
    reset({
      email: customer?.email,
      firstName: customer?.firstName,
      lastName: customer?.lastName,
      dateOfBirth: customer?.dateOfBirth
        ? parseDate(customer.dateOfBirth)
        : undefined,
      password: undefined,
    });
  }, [customer]);
  const [mode, setMode] = useState(false);

  const { isLoading, error, resetError, editPersonal } = CustomerSettings();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const onSubmit = async (value: boolean): Promise<true | undefined> => {
    if (Object.keys(errors).length === 0) {
      try {
        await editPersonal(getValues()).then((data) => {
          if (data) {
            setCustomer(data);
          }
        });
        setMode(!value);
        resetError();

        return true;
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
      addressEdit={false}
      className="col-span-12 h-fit min-h-[410px] w-[320px] p-[20px] sm:col-span-4"
      headerClass="flex-col items-center p-0"
      isLoading={isLoading}
      noErrors={!Boolean(errors)}
      title="Your Information"
      onCancel={(value: boolean) => {
        setMode(!value);
        reset();
      }}
      onEdit={(value: boolean) => {
        setMode(!value);
      }}
      onSave={(value: boolean) => onSubmit(value)}
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
            disabled: !mode || isLoading,
            showPassword: false,
          }}
          register={register}
        />
      </div>
    </EditableCard>
  );
}
