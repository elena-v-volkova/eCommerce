import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

import LoginForm from '../ui/LoginForm';

describe('LoginForm', () => {
  it('renders login form with email and password inputs', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter your password/i),
    ).toBeInTheDocument();
  });
  it('shows validation errors if fields are empty', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.click(submitButton);

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(
      await screen.findByText('Password is too short'),
    ).toBeInTheDocument();
  });
});
