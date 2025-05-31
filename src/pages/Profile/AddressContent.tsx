import { BaseAddress, Customer } from '@commercetools/platform-sdk';
import { Chip } from '@heroui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheckBig } from 'lucide-react';
import { useState } from 'react';

import { EditableCard } from './EditableCard';

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
  const {
    register,
    trigger,
    setValue,
    handleSubmit,
    reset,
    control,
    getValues,
    formState: { errors },
  } = useForm<AddressFields>({
    resolver: zodResolver(ADDRESS_SCHEMA),
    mode: 'onChange',
    defaultValues: {
      address: {
        country: CodeToCountry(value.country) || '',
        city: value.city || '',
        postalCode: value.postalCode || '',
        streetName: value.streetName || '',
      },
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
    if (!Boolean(errors)) {
      setMode(false);
      console.log(data);
    }
  };

  return (
    <EditableCard
      className="col-span-12 h-fit min-h-[410px] w-[320px] p-[20px] sm:col-span-4"
      headerChildren={
        prop.default && (
          <Chip
            color="secondary"
            endContent={<CircleCheckBig size={18} />}
            variant="faded"
          >
            Default
          </Chip>
        )
      }
      noErrors={!Boolean(errors)}
      title={title}
      onCancel={(value: boolean) => {
        setMode(!value);
        reset();
      }}
      onEdit={(value: boolean) => {
        setMode(!value);
      }}
      onSave={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-start gap-2">
        <AddressFields
          control={control}
          disabled={!mode}
          errors={errors}
          newAddress={false}
          prefix="address"
          register={register}
          setValue={setValue}
          title=""
          trigger={trigger}
        />
      </div>
    </EditableCard>
  );
}
