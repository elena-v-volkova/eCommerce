import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';

import useLogin from '../hooks/useLogin';

import { AppRoute } from '@/routes/appRoutes';

// Мокаем зависимости
vi.mock('react-router', () => ({
  useNavigate: () => mockedNavigate,
}));

vi.mock('@/shared/model/useSession', () => ({
  useSession: () => ({
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

// Моки
const mockedNavigate = vi.fn();
const mockedLogin = vi.fn();
const mockedExecute = vi.fn();

// Очистка перед каждым тестом
beforeEach(() => {
  vi.clearAllMocks();
});

describe('useLogin', () => {
  it('calls login and navigates on successful login', async () => {
    mockedExecute.mockResolvedValueOnce({
      body: { customer: { id: '1', email: 'test@example.com' } },
    });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.fetchUser({
        email: 'test@example.com',
        password: 'Password123',
      });
    });

    expect(mockedLogin).toHaveBeenCalledWith({
      id: '1',
      email: 'test@example.com',
    });
    expect(mockedNavigate).toHaveBeenCalledWith(AppRoute.home, {
      replace: true,
    });
    expect(result.current.error).toBe(null);
    expect(result.current.isLoading).toBe(false);
  });

  it('sets error message on failed login', async () => {
    mockedExecute.mockRejectedValueOnce({
      message: 'Invalid credentials',
    });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.fetchUser({
        email: 'wrong@example.com',
        password: 'wrongpass',
      });
    });

    expect(mockedLogin).not.toHaveBeenCalled();
    expect(mockedNavigate).not.toHaveBeenCalled();
    expect(result.current.error).toBe('Invalid credentials');
    expect(result.current.isLoading).toBe(false);
  });

  it('does not call login if email and password are missing', async () => {
    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.fetchUser({ email: '', password: '' });
    });

    expect(mockedLogin).not.toHaveBeenCalled();
    expect(mockedNavigate).not.toHaveBeenCalled();
    expect(result.current.error).toBe(null);
  });
});
