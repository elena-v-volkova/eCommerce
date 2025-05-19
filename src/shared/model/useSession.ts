import { useState } from 'react';
import { Customer } from '@commercetools/platform-sdk';

const TOKEN_KEY = 'authTokens';
const USER_DATA = 'userData';

interface TokenStore {
  accessToken: string;
  refreshToken: string;
  expirationTime: number;
}

export function useSession() {
  const [token, setToken] = useState<TokenStore | null>(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_DATA);
    return stored ? JSON.parse(stored) : null;
  });

  const login = (result: Customer) => {
    const customer = result;
    const userData = {
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
    };

    localStorage.setItem(USER_DATA, JSON.stringify(userData));
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA);
    setUser(null);
    setToken(null);
  };

  return { login, logout, token, user, setUser };
}
