import { BaseAddress, Customer } from '@commercetools/platform-sdk';
import { Chip, useDisclosure } from '@heroui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheckBig } from 'lucide-react';
import { useState } from 'react';
import { Plus } from 'lucide-react';

import { EditableCard } from './EditableCard';
import { CheckBoxes } from './CheckBoxes';
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
      <CardAddress />
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
  address?: BaseAddress;
  prop?: AddressType;
  id?: string;
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
    defaultValues: address
      ? {
          address: {
            country: CodeToCountry(address.country) || '',
            city: address.city || '',
            postalCode: address.postalCode || '',
            streetName: address.streetName || '',
          },
        }
      : {
          address: { country: '', city: '', postalCode: '' },
          streetName: '',
        },
  });
  const [mode, setMode] = useState(false);
  const title = (() => {
    if (prop && prop.type) {
      return prop.type === 'billing' ? 'Billing Address' : 'Shipping Address';
    } else {
      return 'NEW';
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
      } catch (error) {
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

  const [createMode, setCreateMode] = useState(false);

  return address || createMode ? (
    <EditableCard
      className="col-span-12 h-fit min-h-[410px] w-[320px] p-[20px] sm:col-span-4"
      editmode={createMode ? true : false}
      headerChildren={
        prop ? (
          prop.default && (
            <Chip
              color="secondary"
              endContent={<CircleCheckBig size={18} />}
              variant="faded"
            >
              Default
            </Chip>
          )
        ) : (
          <CheckBoxes />
        )
      }
      headerClass={
        createMode ? 'mb-[20px] content-center justify-between' : undefined
      }
      isLoading={isLoading}
      noErrors={!Boolean(errors)}
      onestate={createMode ? true : false}
      title={title ? title : 'New Address'}
      onCancel={(value: boolean) => {
        if (createMode) {
          setCreateMode(false);
        }
        setMode(!value);
        reset();
      }}
      onEdit={(value: boolean) => {
        setMode(!value);
      }}
      onSave={onSubmit}
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
          disabled={!address ? Boolean(!createMode) : Boolean(!mode)}
          // disabled={false }
          errors={errors}
          newAddress={createMode ? true : false}
          prefix="address"
          register={register}
          setValue={setValue}
          title=""
          trigger={trigger}
        />
      </div>
    </EditableCard>
  ) : (
    <div
      className="flex h-[410px] w-[320px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-[20px] text-primary transition-colors hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 sm:col-span-4"
      onClick={() => setCreateMode(true)}
    >
      <Plus absoluteStrokeWidth size={64} strokeWidth={3} />
    </div>
  );
}
