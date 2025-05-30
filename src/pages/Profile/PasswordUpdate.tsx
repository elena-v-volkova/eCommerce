import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Customer } from '@commercetools/platform-sdk';
import {
  Input,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';

import { EditableCard } from './EditableCard';

import { REGISTER_SCHEMA } from '@/components/RegisterForm/lib/utils';
import { PasswordInput } from '@/components/PasswordInput';
import { CustomerSettings } from '@/shared/store/customerProfile';
import { useAuth } from '@/shared/model/AuthContext';

const PASSWORD_UPDATE_SCHEMA = z
  .object({
    current: z.string().optional(),
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
  });
  const { user }: { readonly user: Customer | null } = useAuth();
  const { changePassword, isLoading, error, resetError } = CustomerSettings();

  const onSubmit = async (data: PasswordFields) => {
    const request = {
      // id: user?.id || '',
      version: user?.version || 1,
      currentPassword: data?.current || '',
      newPassword: data.password || '',
    };

    try {
      await changePassword(request);
      reset();
    } catch {
      onOpenChange();
    }
  };
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (error) {
      onOpen();
    } else {
      onOpenChange();
    }
  }, [error, onOpen, onOpenChange]);

  const handleClose = () => {
    resetError();
    onOpenChange();
  };

  return (
    <EditableCard
      className="col-span-12 h-fit min-h-[410px] w-[320px] p-[20px] sm:col-span-4 "
      editmode={true}
      headerClass="flex-col items-center flex-start p-0"
      isLoading={isLoading}
      onestate={true}
      title="Change password"
      onCancel={() => resetError()}
      onSave={handleSubmit(onSubmit)}
    >
      {error && (
        <Modal
          isDismissable={false}
          isKeyboardDismissDisabled={true}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Info</ModalHeader>
                <ModalBody>
                  <p>{error}</p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="secondary"
                    variant="light"
                    onPress={handleClose}
                  >
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
      <div className="flex flex-col items-center">
        <Input
          isRequired
          type="password"
          {...register('current')}
          label="Enter current password"
        />
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
