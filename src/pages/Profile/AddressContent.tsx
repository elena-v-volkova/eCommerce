import { BaseAddress, Customer } from '@commercetools/platform-sdk';
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
import { CircleCheckBig } from 'lucide-react';
import { useState } from 'react';

import {
  REGISTER_SCHEMA,
  TRegisterFieldsSchema,
} from '@/components/RegisterForm/lib/utils';
import { AddressFields } from '@/components/RegisterForm/ui/Address';
import { CodeToCountry } from '@/shared/store/countries';
import { AddressType } from '@/types';

export function AddressContent({ customer }: { customer: Customer | null }) {
  return (
    <div className="flex min-h-[180px] w-full justify-center gap-[20px]">
      {customer &&
        customer.addresses.length > 0 &&
        customer.addresses.map((item) => {
          const info = checkVariants(item.id || '', customer);

          return <CardAddress key={item.id} prop={info} value={item} />;
        })}
    </div>
  );
}

function checkVariants(id: string, customer: Customer): AddressType {
  const isDefaultShipping = (customer.defaultShippingAddressId || '') === id;
  const isDefaultBilling = (customer.defaultBillingAddressId || '') === id;
  const isShipping = customer.shippingAddressIds?.includes(id);
  const isBilling = customer.billingAddressIds?.includes(id);

  if (isShipping) return { type: 'shipping', default: isDefaultShipping };
  if (isBilling) return { type: 'billing', default: isDefaultBilling };

  return { type: undefined, default: false };
}

const ADDRESS_SCHEMA = REGISTER_SCHEMA.pick({ address: true });

type AddressFields = Pick<TRegisterFieldsSchema, 'address'>;

function CardAddress({
  value,
  prop,
}: {
  value: BaseAddress;
  prop: AddressType;
}) {
  const initial = {
    country: CodeToCountry(value.country) || '',
    city: value.city || '',
    postalCode: value.postalCode || '',
    streetName: value.streetName || '',
  };

  const {
    register,
    trigger,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFields>({
    resolver: zodResolver(ADDRESS_SCHEMA),
    mode: 'onChange',
    defaultValues: {
      address: initial,
    },
  });
  const [mode, setMode] = useState(false);
  const title = (() => {
    if (prop.type) {
      return prop.type === 'billing' ? 'Billing Address' : 'Shipping Address';
    }

    return 'Address';
  })();

  const onSubmit = (data: AddressFields) => {
    console.log(data);
    setMode(false);
  };

  return (
    <Card className="col-span-12 h-fit min-h-[410px] w-[320px] p-[20px] sm:col-span-4">
      <CardHeader className="flex h-8 flex-row justify-between">
        <h4 className="text-large font-medium text-teal-600">{title}</h4>
        {prop.default && (
          <Chip
            color="success"
            endContent={<CircleCheckBig size={18} />}
            variant="faded"
          >
            Default
          </Chip>
        )}
      </CardHeader>
      <CardBody className="overflow-visible p-0">
        <Form>
          <AddressFields
            disabled={!mode}
            errors={errors}
            newAddress={false}
            prefix="address"
            register={register}
            setValue={setValue}
            title=""
            trigger={trigger}
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
