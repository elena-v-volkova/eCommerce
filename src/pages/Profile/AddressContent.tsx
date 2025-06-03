import { BaseAddress, Customer } from '@commercetools/platform-sdk';
import { Chip, useDisclosure } from '@heroui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheckBig } from 'lucide-react';
import { useState, useEffect, ReactNode, useCallback } from 'react';
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
import { useSession } from '@/shared/model/useSession.ts';

export function AddressContent({ value }: { value: Customer | null }) {
  const { user } = useSession();
  const [content, setContent] = useState<ReactNode>(null);
  //TODO доработать обновление
  const handleUpdate = useCallback(
    (data: Customer) => {
      cosole.log(data);
      setContent(renderData());
    },
    [user, value],
  );

  const renderData = useCallback(
    (value): ReactNode => {
      const customer = value || user;

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
                  onUpdate={handleUpdate}
                />
              );
            })}
          <CardAddress newAddress={true} onUpdate={handleUpdate} />
        </div>
      );
    },
    [value, user, handleUpdate],
  );

  useEffect(() => {
    setContent(renderData());
  }, [renderData]);

  return content;
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
  onUpdate = (value: Customer) => {},
}: {
  address?: BaseAddress;
  prop?: AddressType;
  id?: string;
  newAddress: boolean;
  onUpdate: (value: Customer) => void;
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
      if (newAddress) return 'NEW';
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
          await createAddress(getValues()).then((customer) => {
            resetError();
            setMode(!mode);
            onUpdate(customer);
          });
          setCreateMode(false);
        } else {
          await editAddress(addressId, getValues().address).then((customer) => {
            resetError();
            setMode(!mode);
            onUpdate(customer);
          });
        }
      } catch (error) {
        console.log(error);
        onOpen();
      }
    }
  };
  const handleDelete = async () => {
    try {
      await deleteAddress(addressId).then((customer) => {
        setMode(!mode);
        onUpdate(customer);
      });
    } catch (error) {
      console.log(error);
      onOpen();
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

  return !newAddress || createMode ? (
    <EditableCard
      addressEdit={Boolean(!createMode)}
      className=" h-fit min-h-[410px]  w-[320px] p-[20px] sm:col-span-1  md:col-span-2 lg:col-span-3"
      classNames={{}}
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
      onDelete={handleDelete}
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
    >
      <Plus absoluteStrokeWidth size={64} strokeWidth={3} />
    </div>
  );
}
