import { BaseAddress, Customer } from '@commercetools/platform-sdk';
import { Chip, useDisclosure } from '@heroui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheckBig } from 'lucide-react';
import { useState } from 'react';

import { EditableCard } from './EditableCard';
import { ProfileModal } from './Modal';

import { CustomerSettings } from '@/shared/store/customerProfile';
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
        customer.addresses.map((item: BaseAddress) => {
          const info = checkVariants(item.id || '', customer);

          return (
            <CardAddress
              key={item.id}
              address={item}
              id={item.id ?? ''}
              prop={info}
            />
          );
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
  address,
  prop,
  id,
}: {
  address: BaseAddress;
  prop: AddressType;
  id: string;
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
        country: CodeToCountry(address.country) || '',
        city: address.city || '',
        postalCode: address.postalCode || '',
        streetName: address.streetName || '',
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

  const { isLoading, error, resetError, editAddress } = CustomerSettings();
  const addressId = id;
  const onSubmit = async (data: boolean) => {
    if (Object.keys(errors).length === 0) {
      try {
        await editAddress(addressId, getValues().address);
        setMode(!mode);
      } catch (error: Error) {
        console.log(error);
        onOpen();
      }
    }
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleClose = () => {
    reset();
    onOpenChange();
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
      onSave={onSubmit}
      isLoading={isLoading}
    >
      {error && (
        <ProfileModal
          close={handleClose}
          errorMessage={error}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}

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
