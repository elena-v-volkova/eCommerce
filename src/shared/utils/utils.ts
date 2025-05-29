import { useState, useEffect } from 'react';

export function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  });

  return width;
}

export function loadMockUser() {
  const user = import.meta.env.VITE_MOCK_CUSTOMER;
  const token = import.meta.env.VITE_MOCK_TOKEN;

  localStorage.setItem('authTokens', token);
  localStorage.setItem('userData', user);
}
