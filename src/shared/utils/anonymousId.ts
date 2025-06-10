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
