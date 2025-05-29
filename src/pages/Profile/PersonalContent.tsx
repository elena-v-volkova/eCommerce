import { Customer } from '@commercetools/platform-sdk';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Form,
} from '@heroui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseDate } from '@internationalized/date';
import { useState } from 'react';

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
    <Card className="col-span-12 h-fit min-h-[410px] w-[320px] p-[20px] sm:col-span-4">
      <CardBody className="overflow-visible p-0">
        <Form
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
            title="Your Information"
          />
        </Form>
      </CardBody>
      <CardFooter className="relative top-[10px] justify-start gap-x-4 border-t-1 border-zinc-100/50 bg-white/30 dark:bg-black/30">
        {mode === false && (
          <Button
            className="text-tiny"
            color="primary"
            radius="full"
            size="sm"
            type="button"
            onClick={() => setMode(true)}
          >
            Edit
          </Button>
        )}
        {mode === true && (
          <>
            <Button
              className="text-tiny"
              color="warning"
              radius="full"
              size="sm"
              type="submit"
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>
            <Button
              className="text-tiny"
              color="default"
              radius="full"
              size="sm"
              type="reset"
              onClick={() => {
                setMode(false);
              }}
            >
              Cancel
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
