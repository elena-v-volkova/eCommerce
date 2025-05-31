import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import LoginForm from '../ui/LoginForm';

import { RouterWrapper } from './test-utils/Wrapper';

describe('LoginForm', () => {
  it('renders login form with email and password inputs', () => {
    render(<LoginForm />, { wrapper: RouterWrapper });

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter your password/i),
    ).toBeInTheDocument();
  });
  it('shows validation errors if fields are empty', async () => {
    const user = userEvent.setup();

    render(<LoginForm />, { wrapper: RouterWrapper });

    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.click(submitButton);

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(
      await screen.findByText('Password is too short'),
    ).toBeInTheDocument();
  });
});
