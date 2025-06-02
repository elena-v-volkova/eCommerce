import { BaseAddress, Customer } from '@commercetools/platform-sdk';
import { Chip, useDisclosure } from '@heroui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheckBig } from 'lucide-react';
import { useState, useEffect } from 'react';
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
              newAddress={false}
              prop={info}
            />
          );
        })}
      <CardAddress newAddress={true} />
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

export type AddressFields = Pick<TRegisterFieldsSchema, 'address'>;
export type NewAddressFields = {
  address: AddressFields;
  shipping?: boolean;
  billing?: boolean;
  defaultShipping?: boolean;
  defaultBilling?: boolean;
};
function CardAddress({
  address,
  prop,
  id,
  newAddress = false,
}: {
  address?: BaseAddress;
  prop?: AddressType;
  id?: string;
  newAddress: boolean;
}) {
  const {
    register,
    trigger,
    setValue,
    handleSubmit,
    reset,
    control,
    getValues,
    watch,
    formState: { errors },
  } = useForm<AddressFields>({
    resolver: zodResolver(ADDRESS_SCHEMA),
    mode: 'onChange',
    defaultValues: newAddress
      ? {
          address: {
            country: undefined,
            city: '',
            postalCode: '',
            streetName: '',
          },
        }
      : {
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
    if (prop && prop.type) {
      return prop.type === 'billing' ? 'Billing Address' : 'Shipping Address';
    } else {
      return 'NEW';
    }

    return 'Address';
  })();

  const {
    isLoading,
    error,
    resetError,
    editAddress,
    createAddress,
    deleteAddress,
  } = CustomerSettings();
  const addressId = id;

  const onSubmit = async (data: boolean) => {
    if (Object.keys(errors).length === 0) {
      try {
        if (newAddress) {
          await createAddress(getValues());
        } else {
          await editAddress(addressId, getValues().address);
        }
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

  useEffect(() => {
    if (createMode) {
      trigger('address');
    }
  }, [createMode]);
  deleteAddress;

  return !newAddress || createMode ? (
    <EditableCard
      className="col-span-12 h-fit min-h-[410px] w-[320px] p-[20px] sm:col-span-4"
      editmode={createMode}
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
          <CheckBoxes register={register} watch={watch} />
        )
      }
      headerClass={
        createMode ? 'mb-[20px] content-center justify-between' : undefined
      }
      isLoading={isLoading}
      noErrors={!Boolean(errors)}
      onestate={createMode}
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
      addressEdit={Boolean(!createMode)}
      onDelete={() => deleteAddress(addressId)}
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
          disabled={newAddress ? Boolean(!createMode) : Boolean(!mode)}
          // disabled={false }
          errors={errors}
          newAddress={createMode}
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
      aria-label="Add new address"
      className="flex h-[410px] w-[320px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-[20px] text-primary transition-colors hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 sm:col-span-4"
      role="button"
      tabIndex={0}
      onClick={() => setCreateMode(true)}
      onKeyDown={(e) =>
        e.key === 'Enter' || e.key === ' ' ? setCreateMode(true) : null
      }
    >
      <Plus absoluteStrokeWidth size={64} strokeWidth={3} />
    </div>
  );
}
