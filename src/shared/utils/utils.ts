import { useState, useEffect } from 'react';
import { DiscountCodePagedQueryResponse } from '@commercetools/platform-sdk';

import { apiUrl, projectKey } from '@/commercetools/buildClient';

export function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  });

  return width;
}

export async function loadPromocodes(): Promise<DiscountCodePagedQueryResponse> {
  try {
    // const authResponse = await fetch(
    //   `${authUrl}.commercetools.com/oauth/token`,
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //       Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    //     },
    //     body: new URLSearchParams({
    //       grant_type: 'client_credentials',
    //       scope: `manage_project:${projectKey}`,
    //     }),
    //   },
    // );

    // if (!authResponse.ok) {
    //   throw new Error(`Auth failed: ${authResponse.status}`);
    // }
    // const { access_token } = await authResponse.json();
    const TOKEN =
      JSON.parse(localStorage.getItem('anonTokens') || '{}').token || '';

    const response = await fetch(`${apiUrl}/${projectKey}/discount-codes`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return (await response.json()) as DiscountCodePagedQueryResponse;
  } catch (error) {
    console.log('Error loading promocodes:', error);
    throw error;
  }
}
