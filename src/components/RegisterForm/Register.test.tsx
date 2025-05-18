import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { RegisterForm } from './ui/RegisterForm';

// register form
const createCustomerMock = vi.fn();
const user = userEvent.setup();

vi.mock('@/shared/model/useRegister', () => ({
  default: () => ({
    createCustomer: createCustomerMock,
    isLoading: false,
    error: null,
  }),
}));

interface I18nProviderProps {
  children: React.ReactNode;
  locale: string;
}

const mocks = vi.hoisted(() => {
  const { CalendarDate } = require('@internationalized/date');

  return {
    today: new CalendarDate(2025, 5, 17),
    getLocalTimeZone: vi.fn(() => 'UTC'),
  };
});

vi.mock('@internationalized/date', () => {
  const actual = vi.importActual('@internationalized/date');

  return {
    ...actual,
    I18nProvider: ({ children, locale }: I18nProviderProps) => (
      <div data-locale={locale}>{children}</div>
    ),
    today: () => mocks.today,
    getLocalTimeZone: mocks.getLocalTimeZone,
  };
});

describe('RegisterForm', () => {
  const onDeliveryChange = vi.fn();

  beforeEach(() => {
    createCustomerMock.mockClear();
    vi.clearAllMocks();
  });
  it('renders user fields when step is "user"', () => {
    render(<RegisterForm step="user" onDeliveryChange={() => {}} />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const firstNameInput = screen.getByLabelText('First name');
    const lastNameInput = screen.getByLabelText('Last name');

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(screen.getByText('Date of birth')).toBeInTheDocument();

    const dateGroup = screen.getByRole('group', {
      name: 'Date of birth',
    });

    expect(dateGroup).toBeInTheDocument();
  });

  it('updates dateOfBirth field on user input', async () => {
    render(<RegisterForm step="user" onDeliveryChange={() => {}} />);

    const dateGroup = screen.getByRole('group', {
      name: 'Date of birth',
    });
    const dayInput = within(dateGroup).getByRole('spinbutton', {
      name: /day/i,
    });
    const monthInput = within(dateGroup).getByRole('spinbutton', {
      name: /month/i,
    });
    const yearInput = within(dateGroup).getByRole('spinbutton', {
      name: /year/i,
    });

    await user.type(dayInput, '1');
    await user.type(monthInput, '15');
    await user.type(yearInput, '1111111');

    expect(dateGroup).toHaveTextContent('01/05/11');
  });

  it('displays error for future date', async () => {
    render(<RegisterForm step={'user'} onDeliveryChange={onDeliveryChange} />);
    const dateGroup = screen.getByRole('group', {
      name: 'Date of birth',
    });
    const dayInput = within(dateGroup).getByRole('spinbutton', {
      name: /day/i,
    });
    const monthInput = within(dateGroup).getByRole('spinbutton', {
      name: /month/i,
    });
    const yearInput = within(dateGroup).getByRole('spinbutton', {
      name: /year/i,
    });

    await user.type(dayInput, '1');
    await user.type(monthInput, '15');
    await user.type(yearInput, '9999');

    await waitFor(() => {
      expect(screen.getByText('Date of birth cannot be in the future'));
    });
  });

  it('calls onDeliveryChange when sameAsDelivery changes', async () => {
    const onDeliveryChange = vi.fn();
    const user = userEvent.setup();

    render(<RegisterForm step={null} onDeliveryChange={onDeliveryChange} />);

    const sameAsDeliveryCheckbox = screen.getByLabelText(
      /Billing and shipping address are the same/,
    );

    await userEvent.click(sameAsDeliveryCheckbox);
    await waitFor(() => {
      expect(onDeliveryChange).toHaveBeenCalledWith(false);
    });

    // Second toggle (back to true)
    await user.click(sameAsDeliveryCheckbox);
    await waitFor(() => {
      expect(onDeliveryChange).toHaveBeenCalledWith(true);
    });
  });

  it('shows billing address when sameAsDelivery is unchecked', async () => {
    render(<RegisterForm step={null} onDeliveryChange={() => {}} />);

    const sameAsDeliveryCheckbox = screen.getByLabelText(
      /Billing and shipping address are the same/,
    );

    await userEvent.click(sameAsDeliveryCheckbox);

    const billingTitle = screen.getByText((content, element) => {
      return element?.textContent === 'Billing address';
    });

    expect(billingTitle).toBeInTheDocument();
  });

  it('submits correctly when all fields are filled', async () => {
    render(<RegisterForm step={null} onDeliveryChange={() => {}} />);

    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'Password123');
    await userEvent.type(screen.getByLabelText('First name'), 'John');
    await userEvent.type(screen.getByLabelText('Last name'), 'Doe');
    await userEvent.type(screen.getByLabelText('Enter street'), '123 Main St');
    await userEvent.type(screen.getByLabelText('Enter city'), 'New York');
    await userEvent.type(screen.getByLabelText('Postal code'), '100101');
    const dateGroup = screen.getByRole('group', {
      name: 'Date of birth',
    });
    const dayInput = within(dateGroup).getByRole('spinbutton', {
      name: /day/i,
    });
    const monthInput = within(dateGroup).getByRole('spinbutton', {
      name: /month/i,
    });
    const yearInput = within(dateGroup).getByRole('spinbutton', {
      name: /year/i,
    });

    await user.type(dayInput, '1');
    await user.type(monthInput, '5');
    await user.type(yearInput, '2008');
    await userEvent.click(screen.getByText('Select Country'));
    await userEvent.click(
      await screen.getByRole('option', {
        name: /Russia/i,
      }),
    );
    await userEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(screen.queryByText(/Заполните все поля/i)).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(createCustomerMock).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '2008-05-01',
        addresses: expect.arrayContaining([
          expect.objectContaining({
            streetName: '123 Main St',
            city: 'New York',
            postalCode: '100101',
            country: 'RU',
            firstName: 'John',
            lastName: 'Doe',
          }),
        ]),
        defaultShippingAddress: 0,
        defaultBillingAddress: 0,
      });
    });
  }, 10000);
});
