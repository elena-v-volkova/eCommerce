import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';

import { useLogin } from '../hooks/useLogin';

import { RouterWrapper } from './test-utils/Wrapper';

vi.mock('react-router', () => ({
  useNavigate: () => mockedNavigate,
}));

vi.mock('@/shared/model/AuthConext', () => ({
  useAuth: () => ({
    login: mockedLogin,
  }),
}));

vi.mock('@/commercetools/login', () => ({
  createPasswordFlowClient: vi.fn(() => ({
    login: () => ({
      post: () => ({
        execute: mockedExecute,
      }),
    }),
  })),
}));

const mockedNavigate = vi.fn();
const mockedLogin = vi.fn();
const mockedExecute = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useLogin', () => {
  it('sets error message on failed login', async () => {
    mockedExecute.mockRejectedValueOnce({
      message: 'Login failed',
    });

    const { result } = renderHook(() => useLogin(), { wrapper: RouterWrapper });

    await act(async () => {
      await result.current.fetchUser({
        email: 'wrong@example.com',
        password: 'wrongpass',
      });
    });

    expect(mockedLogin).not.toHaveBeenCalled();
    expect(mockedNavigate).not.toHaveBeenCalled();
    expect(result.current.error).toBe('Login failed');
    expect(result.current.isLoading).toBe(false);
  });

  it('does not call login if email and password are missing', async () => {
    const { result } = renderHook(() => useLogin(), { wrapper: RouterWrapper });

    await act(async () => {
      await result.current.fetchUser({ email: '', password: '' });
    });

    expect(mockedLogin).not.toHaveBeenCalled();
    expect(mockedNavigate).not.toHaveBeenCalled();
    expect(result.current.error).toBe(null);
  });
});
