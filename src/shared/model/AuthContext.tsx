import { createContext, useContext, useState, ReactNode } from 'react';
import { Customer } from '@commercetools/platform-sdk';
import { useLocation, useNavigate } from 'react-router';
import { clearCartId } from '@/shared/utils/anonymousId';
import { AppRoute } from '@/routes/appRoutes';

interface AuthContextType {
  user: Customer | null;
  login: (user: Customer) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Customer | null>(() => {
    const stored = localStorage.getItem('userData');

    return stored ? JSON.parse(stored) : null;
  });
  const location = useLocation();
  const navigate = useNavigate();

  const login = (userData: Customer) => {
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('authTokens');
    clearCartId();
    setUser(null);
    if (location.pathname === `/${AppRoute.profile}`) {
      navigate(AppRoute.home);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
