import { anonymousTokenCache } from '@/commercetools/buildClient';

export const getAnonymousId = (): string => {
  const stored = localStorage.getItem('anonymousId');

  if (stored) return stored;

  const newId = crypto.randomUUID();

  localStorage.setItem('anonymousId', newId);

  return newId;
};

export const clearAnonymousId = (): void => {
  localStorage.removeItem('anonymousId');
};

export const clearAnonymousSession = () => {
  anonymousTokenCache.set({ token: '', expirationTime: 0, refreshToken: '' });
  localStorage.removeItem('anonymousId');
};

export const generateNewAnonymousId = (): string => {
  const newId = crypto.randomUUID();

  localStorage.setItem('anonymousId', newId);
  localStorage.removeItem('anonTokens');

  return newId;
};

// Получить cartId
export const getCartId = (): string | null => {
  return localStorage.getItem('cartId');
};

// Сохранить cartId
export const setCartId = (id: string): void => {
  localStorage.setItem('cartId', id);
};

// Удалить cartId
export const clearCartId = (): void => {
  localStorage.removeItem('cartId');
};
