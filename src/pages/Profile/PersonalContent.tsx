import { Customer } from '@commercetools/platform-sdk';
import { Form } from '@heroui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseDate } from '@internationalized/date';

import { PersonalInfo } from '@/components/RegisterForm/ui/PersonalInfo';
import {
  REGISTER_SCHEMA,
  TRegisterFieldsSchema,
} from '@/components/RegisterForm/lib/utils';

export function PersonalContent({ customer }: { customer: Customer | null }) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegisterFieldsSchema>({
    resolver: zodResolver(REGISTER_SCHEMA),
    mode: 'onChange',
    defaultValues: {
      email: customer?.email,
      firstName: customer?.firstName,
      lastName: customer?.lastName,
      dateOfBirth: parseDate(customer?.dateOfBirth?.toString() || ''),
    },
  });
  const onSubmit = async (data: TRegisterFieldsSchema) => {
    console.log(data);
  };

  return (
    <Form
      className="grid size-auto grid-cols-[auto_320_320] grid-rows-[auto] justify-items-center gap-4"
      data-testid="form-personal-profile"
      onSubmit={handleSubmit(onSubmit)}
    >
      <PersonalInfo
        control={control}
        errors={errors}
        personalProps={{ user: customer, editMode: true, showPassword: false }}
        register={register}
        title="Your Information"
      />
    </Form>
  );
}
