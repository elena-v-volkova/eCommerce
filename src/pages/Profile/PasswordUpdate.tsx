import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Customer } from '@commercetools/platform-sdk';
import { Input, useDisclosure } from '@heroui/react';
import { useState } from 'react';

import { ProfileModal } from './Modal';
import { EditableCard } from './EditableCard';

import { REGISTER_SCHEMA } from '@/components/RegisterForm/lib/utils';
import { PasswordInput } from '@/components/PasswordInput';
import { CustomerSettings } from '@/shared/store/customerProfile';
import { useAuth } from '@/shared/model/AuthContext';

const PASSWORD_UPDATE_SCHEMA = z
  .object({
    current: z.string().optional(),
    password: REGISTER_SCHEMA.shape.password,
    repeat: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.repeat) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Value must match the new password',
        path: ['repeat'],
      });
    }
    if (data.password === data.current) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'New password must be different from current',
        path: ['password'],
      });
    }
  });

type PasswordFields = z.infer<typeof PASSWORD_UPDATE_SCHEMA>;

export function PasswordUpdate() {
  const {
    reset,
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<PasswordFields>({
    resolver: zodResolver(PASSWORD_UPDATE_SCHEMA),
    mode: 'onChange',
  });
  const { user }: { readonly user: Customer | null } = useAuth();
  const { changePassword, isLoading, error, resetError } = CustomerSettings();

  const [mode, setMode] = useState(false);

  const onSubmit = async (data: PasswordFields) => {
    if (Object.keys(errors).length === 0) {
      const request = {
        // id: user?.id || '',
        version: user?.version || 1,
        currentPassword: data?.current || '',
        newPassword: data.password || '',
      };

      try {
        await changePassword(request);
        reset();
        setMode(!mode);
      } catch {
        onOpen();
      }
    }
  };
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleClose = () => {
    resetError();
    onOpenChange();
  };

  return (
    <EditableCard
      addressEdit={false}
      className="col-span-12 h-fit min-h-[410px] w-[320px] p-[20px] sm:col-span-4"
      headerClass="flex-col items-center flex-start p-0"
      isLoading={isLoading}
      noErrors={!Boolean(errors)}
      title="Change password"
      onCancel={() => {
        resetError(), reset();
        setMode(false);
      }}
      onEdit={() => {
        setMode(!mode);
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
      <div className="flex flex-col items-center">
        <Input
          isRequired
          type="password"
          {...register('current')}
          isDisabled={!mode}
          label="Enter current password"
          onChange={(e) => {
            const value = e.target.value;

            setValue('current', value);
            trigger(`password`);
          }}
        />
        <div className="mt-5">{mode ? 'Write new password' : ''}</div>
        <PasswordInput
          errorMessage={errors.password?.message}
          isDisabled={!mode}
          isInvalid={!!errors.password}
          register={register('password')}
          onChange={(e) => {
            const value = e.target.value;

            setValue('password', value);
            trigger(`password`);
            trigger(`repeat`);
          }}
        />
        <div className="mt-5">{mode ? 'Repeat new password' : ''}</div>
        <PasswordInput
          errorMessage={errors.repeat?.message}
          isDisabled={!mode}
          isInvalid={!!errors.repeat}
          register={register('repeat')}
          onChange={(e) => {
            const value = e.target.value;

            setValue('repeat', value);
            trigger(`password`);
            trigger(`repeat`);
          }}
        />
      </div>
    </EditableCard>
  );
}
