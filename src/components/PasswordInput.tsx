import { Input } from '@heroui/react';
import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import { EyeFilledIcon, EyeSlashFilledIcon } from '@/components/Icons';

interface PasswordInputProps {
  register: UseFormRegisterReturn;
  errorMessage?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  type?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  register,
  errorMessage,
  isInvalid,
  isDisabled = false,
  onChange,
  ...props
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
    register.onChange(e);
  };

  return (
    <Input
      label="Password"
      labelPlacement="outside"
      type={isVisible ? 'text' : 'password'}
      {...register}
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
        >
          {!isVisible ? (
            <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
          ) : (
            <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
          )}
        </button>
      }
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      onChange={handleChange}
      {...props}
    />
  );
};
