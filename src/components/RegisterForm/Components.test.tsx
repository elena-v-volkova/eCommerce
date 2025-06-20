import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, FormProvider } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

import { PasswordInput } from '../PasswordInput';

import { TRegisterFieldsSchema } from './lib/utils';
import { AddressFields } from './ui/Address';

import { NavFields } from '@/pages/Register/RegisterPage';

describe('PasswordInput', () => {
  it('renders correctly and toggles visibility', async () => {
    const mockRegister = {
      onChange: vi.fn(),
      onBlur: vi.fn(),
      name: 'password',
      ref: vi.fn(),
    };

    render(
      <PasswordInput
        errorMessage="error"
        isInvalid={false}
        placeholder="password"
        register={mockRegister}
      />,
    );

    const input = screen.getByLabelText('Password');
    const toggleButton = screen.getByRole('button');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveAttribute('placeholder', 'password');

    await userEvent.click(toggleButton);
    await waitFor(() => {
      expect(input).toHaveAttribute('type', 'text');
    });

    await userEvent.click(toggleButton);
    await waitFor(() => {
      expect(input).toHaveAttribute('type', 'password');
    });
  });

  it('shows error message when provided', async () => {
    const mockRegister = {
      onChange: vi.fn(),
      onBlur: vi.fn(),
      name: 'password',
      ref: vi.fn(),
    };

    render(
      <PasswordInput
        errorMessage="Password is required"
        isInvalid={true}
        placeholder="password"
        register={mockRegister}
      />,
    );

    const errorMessage = screen.getByText('Password is required');

    expect(errorMessage).toBeInTheDocument();

    const input = screen.getByLabelText('Password');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('placeholder', 'password');
  });
});

function TestAddressFields() {
  const props = useForm<TRegisterFieldsSchema>();

  return (
    <FormProvider {...props}>
      <AddressFields
        control={props.control}
        errors={props.formState.errors}
        prefix="address"
        register={props.register}
        setValue={props.setValue}
        title="Shipping address"
        trigger={props.trigger}
      />
    </FormProvider>
  );
}

describe('AddressFields', () => {
  it('renders all fields', () => {
    render(<TestAddressFields />);
    const countrySelect = screen.getByLabelText('Select Country');
    const cityInput = screen.getByLabelText('Enter city');
    const streetInput = screen.getByLabelText('Enter street');
    const postalCodeInput = screen.getByLabelText('Postal code');

    expect(countrySelect).toBeInTheDocument();
    expect(cityInput).toBeInTheDocument();
    expect(streetInput).toBeInTheDocument();
    expect(postalCodeInput).toBeInTheDocument();
  });
});

describe('NavFields', () => {
  it('navigates to different steps', async () => {
    const mockOnStepChange = vi.fn();

    render(
      <NavFields
        currentStep="user"
        sameAsDelivery={true}
        onStepChange={mockOnStepChange}
      />,
    );

    const shippingLink = screen.getByText('Shipping Address');

    await userEvent.click(shippingLink);

    await waitFor(
      () => {
        expect(mockOnStepChange).toHaveBeenCalledWith('shipping');
      },
      { timeout: 1000 },
    );
  });
});
