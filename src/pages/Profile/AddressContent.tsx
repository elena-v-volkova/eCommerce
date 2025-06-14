import { BaseAddress, Customer } from '@commercetools/platform-sdk';
import { Chip, useDisclosure } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheckBig, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { undefined } from 'zod';

import { CheckBoxes } from './AddressCheckBoxes';
import { EditableCard } from './EditableCard';
import { ProfileModal } from './Modal';
import styles from './ProfilePage.module.scss';

import {
  REGISTER_SCHEMA,
  TRegisterFieldsSchema,
} from '@/components/RegisterForm/lib/utils';
import { AddressFields } from '@/components/RegisterForm/ui/Address';
import { useSession } from '@/shared/model/useSession';
import { CodeToCountry } from '@/shared/store/countries';
import { CustomerSettings } from '@/shared/store/customerProfile';
import { AddressType } from '@/types';
import { showAddressType } from '@/pages/Profile/showAddressType';

export function AddressContent() {
  const { user } = useSession();
  const [addresses, setAddresses] = useState<BaseAddress[]>(user?.addresses);
  const [customer, setCustomer] = useState<Customer>(user);

  const handleUpdate = (data: Customer) => {
    setAddresses(data.addresses);
    setCustomer(data);
  };

  return (
    <div
      className={` flex min-h-[180px] w-full flex-wrap  content-center ${styles.address} gap-[20px]`}
    >
      {addresses &&
        addresses.length > 0 &&
        addresses.map((item: BaseAddress) => {
          const info = showAddressType(item.id || '', customer);

          return (
            <CardAddress
              key={item.id}
              address={item}
              id={item.id ?? ''}
              isNewAddress={false}
              prop={info}
              onUpdate={handleUpdate}
            />
          );
        })}
      <CardAddress isNewAddress={true} onUpdate={handleUpdate} />
    </div>
  );
}

const ADDRESS_SCHEMA = REGISTER_SCHEMA.pick({ address: true });

export type AddressFields = Pick<TRegisterFieldsSchema, 'address'>;
export type ProfileAddressFields = {
  address: AddressFields;
  shipping: boolean;
  billing: boolean;
  defaultShipping: boolean;
  defaultBilling: boolean;
};

function CardAddress({
  address,
  prop,
  id,
  isNewAddress,
  onUpdate = (value: Customer) => {},
}: {
  address?: BaseAddress;
  prop?: AddressType;
  id?: string;
  isNewAddress: boolean;
  onUpdate: (value: Customer) => void;
}) {
  let initialValues: ProfileAddressFields = {
    shipping: prop?.shipping || false,
    billing: prop?.billing || false,
    defaultShipping: prop?.defaultShipping || false,
    defaultBilling: prop?.defaultBilling || false,
    address: {
      country: CodeToCountry(address?.country) || '',
      city: address?.city || '',
      postalCode: address?.postalCode || '',
      streetName: address?.streetName || '',
    },
  };
  const {
    register,
    trigger,
    setValue,
    reset,
    control,
    getValues,
    formState: { errors },
  } = useForm<ProfileAddressFields>({
    resolver: zodResolver(ADDRESS_SCHEMA),
    mode: 'onChange',
    defaultValues: initialValues,
  });

  useEffect(() => {
    initialValues = {
      shipping: prop?.shipping || false,
      billing: prop?.billing || false,
      defaultShipping: prop?.defaultShipping || false,
      defaultBilling: prop?.defaultBilling || false,
      address: {
        country: CodeToCountry(address?.country) || '',
        city: address?.city || '',
        postalCode: address?.postalCode || '',
        streetName: address?.streetName || '',
      },
    };
    reset(initialValues);
  }, [prop, address]);

  const [mode, setMode] = useState<boolean>(isNewAddress);
  const title = (() => {
    if (prop && prop.label) {
      return prop.label;
    } else {
      if (isNewAddress) return 'NEW';
    }
  })();

  const {
    isLoading,
    error,
    resetError,
    editAddress,
    createAddress,
    deleteAddress,
    unsetAddressTypes,
  } = CustomerSettings();
  const addressId = id || '';

  const onSubmit = async (value: boolean) => {
    if (Object.keys(errors).length === 0) {
      try {
        let customer: Customer | null;

        if (isNewAddress) {
          customer = await createAddress(getValues());
        } else {
          await unsetAddressTypes(initialValues, getValues(), addressId);
          customer = await editAddress(addressId, getValues());
        }
        // reset( );
        resetError();
        if (isNewAddress) reset();
        setCreateMode(!value);
        if (!isNewAddress) setMode(!value);
        onUpdate(customer);

        return true;
      } catch {
        onOpen();

        return false;
      }
    }
  };
  const handleDelete = async (value: boolean) => {
    let customer = null;

    try {
      customer = await deleteAddress(addressId);

      resetError();
      setCreateMode(!value);
      setMode(!value);
      if (customer !== null) {
        onUpdate(customer);
      }

      return true;
    } catch {
      onOpen();

      return false;
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

  return !isNewAddress || createMode ? (
    <EditableCard
      addressEdit={Boolean(!createMode)}
      className=" h-fit min-h-[410px]  w-[320px] p-[20px] sm:col-span-1  md:col-span-2 lg:col-span-3"
      createAddress={isNewAddress}
      editmode={createMode}
      headerChildren={
        <div
          className={
            mode
              ? 'mb-[20px] content-center justify-between'
              : ' absolute right-5  top-5'
          }
        >
          {prop?.default && !mode && !isNewAddress && (
            <Chip
              color="secondary"
              endContent={<CircleCheckBig size={18} />}
              variant="faded"
            >
              {prop.type}
            </Chip>
          )}
          {(mode || createMode) && <CheckBoxes register={register} />}
        </div>
      }
      headerClass={
        createMode ? 'mb-[20px] content-center justify-between' : undefined
      }
      isLoading={isLoading}
      noErrors={!Boolean(errors)}
      onestate={isNewAddress}
      title={title}
      onCancel={(value: boolean) => {
        if (createMode) {
          setCreateMode(false);
        }
        if (!isNewAddress) setMode(!value);
        reset();
      }}
      onDelete={handleDelete}
      onEdit={(value: boolean) => {
        setMode(!value);
      }}
      onSave={(value: boolean) => onSubmit(value)}
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
          disabled={!mode || isLoading}
          editmode={mode}
          errors={errors}
          newAddress={isNewAddress}
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
      onClick={() => {
        setCreateMode(true);
        setMode(true);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setCreateMode(true);
          setMode(true);
        }
      }}
    >
      <Plus absoluteStrokeWidth size={64} strokeWidth={3} />
    </div>
  );
}
