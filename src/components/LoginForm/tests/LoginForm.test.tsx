import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';
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
});
