import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { EditableCard } from './EditableCard';

import { REGISTER_SCHEMA } from '@/components/RegisterForm/lib/utils';
import { PasswordInput } from '@/components/PasswordInput';

const PASSWORD_UPDATE_SCHEMA = z
  .object({
    password: REGISTER_SCHEMA.shape.password,
    repeat: z.string(),
  })
  .refine((data) => data.password === data.repeat, {
    message: 'Passwords must match the new password',
    path: ['repeat'],
  });

type PasswordFields = z.infer<typeof PASSWORD_UPDATE_SCHEMA>;

export function PasswordUpdate() {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFields>({
    resolver: zodResolver(PASSWORD_UPDATE_SCHEMA),
    mode: 'onChange',
    defaultValues: {
      password: '',
      repeat: '',
    },
  });

  const onSubmit = (data: PasswordFields) => {
    console.log(data);
  };

  return (
    <EditableCard
      className="col-span-12 h-fit min-h-[410px] w-[320px] p-[20px] sm:col-span-4"
      editmode={true}
      onestate={true}
      title="Manage password"
      onCancel={reset}
      onEdit={() => console.log('Edit mode activated')}
      onSave={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-center">
        <div className="mt-5">Write new password</div>
        <PasswordInput
          errorMessage={errors.password?.message}
          isInvalid={!!errors.password}
          register={register('password')}
        />
        <div className=" mt-5">Repeat new password</div>
        <PasswordInput
          errorMessage={errors.repeat?.message}
          isInvalid={!!errors.repeat}
          register={register('repeat')}
        />
      </div>
    </EditableCard>
  );
}
