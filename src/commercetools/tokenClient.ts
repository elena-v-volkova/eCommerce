// api/tokenClient.ts
import { ClientBuilder } from '@commercetools/ts-client';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

import {
  httpMiddlewareOptions,
  projectKey,
  clientId,
  clientSecret,
  authUrl,
} from './buildClient';

interface TokenData {
  token: string;
  refreshToken: string;
  expirationTime: number;
}

export function createTokenClient() {
  const storedTokens = localStorage.getItem('authTokens');

  if (!storedTokens) {
    throw new Error('No authentication tokens found');
  }

  const tokens: TokenData = JSON.parse(storedTokens);

  if (!tokens.token) {
    throw new Error('Invalid authentication token');
  }

  // Create client with existing token
  const client = new ClientBuilder()
    .withProjectKey(projectKey)
    .withExistingTokenFlow(`Bearer ${tokens.token}`, {
      force: true,
    })
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();

  return createApiBuilderFromCtpClient(client).withProjectKey({
    projectKey,
  });
}

// Helper function to check if token is expired
export function isTokenExpired(): boolean {
  const storedTokens = localStorage.getItem('authTokens');

  if (!storedTokens) {
    return true;
  }

  try {
    const tokens: TokenData = JSON.parse(storedTokens);
    const currentTime = Date.now();

    // Add 5 minute buffer before expiration
    return currentTime >= tokens.expirationTime - 5 * 60 * 1000;
  } catch {
    return true;
  }
}

// Helper function to refresh token if needed
export async function refreshTokenIfNeeded() {
  if (!isTokenExpired()) {
    return createTokenClient();
  }

  const storedTokens = localStorage.getItem('authTokens');

  if (!storedTokens) {
    throw new Error('No tokens to refresh');
  }

  const tokens: TokenData = JSON.parse(storedTokens);

  if (!tokens.refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    // Create a client for token refresh using your auth URL
    const refreshClient = new ClientBuilder()
      .withProjectKey(projectKey)
      .withRefreshTokenFlow({
        host: authUrl, // Using your us-central1 auth URL
        projectKey,
        credentials: {
          clientId,
          clientSecret,
        },
        refreshToken: tokens.refreshToken,
      })
      .withHttpMiddleware(httpMiddlewareOptions)
      .build();

    // Execute a request to trigger token refresh
    const apiRoot = createApiBuilderFromCtpClient(refreshClient).withProjectKey(
      {
        projectKey,
      },
    );

    // Make a simple request to trigger token refresh
    await apiRoot.me().get().execute();

    // Return the updated client
    return createTokenClient();
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw new Error('Token refresh failed. Please login again.');
  }
}

// User profile service using tokens
export class UserProfileService {
  private _apiRoot: any;

  constructor() {
    this._apiRoot = createTokenClient();
  }

  async getCurrentUser() {
    try {
      const response = await this._apiRoot.me().get().execute();

      return response.body;
    } catch (error: any) {
      // Check if it's a 401 unauthorized error
      if (error.statusCode === 401 || isTokenExpired()) {
        try {
          // Try to refresh and retry
          this._apiRoot = await refreshTokenIfNeeded();
          const response = await this._apiRoot.me().get().execute();

          return response.body;
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          throw new Error('Session expired. Please login again.');
        }
      }
      throw error;
    }
  }

  async updateProfile(version: number, actions: any[]) {
    try {
      const response = await this._apiRoot
        .me()
        .post({
          body: {
            version,
            actions,
          },
        })
        .execute();

      return response.body;
    } catch (error: any) {
      if (error.statusCode === 401 || isTokenExpired()) {
        try {
          this._apiRoot = await refreshTokenIfNeeded();
          const response = await this._apiRoot
            .me()
            .post({
              body: {
                version,
                actions,
              },
            })
            .execute();

          return response.body;
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          throw new Error('Session expired. Please login again.');
        }
      }
      throw error;
    }
  }

  async changePassword(
    version: number,
    currentPassword: string,
    newPassword: string,
  ) {
    try {
      await this._apiRoot
        .me()
        .password()
        .post({
          body: {
            version,
            currentPassword,
            newPassword,
          },
        })
        .execute();
    } catch (error: any) {
      if (error.statusCode === 401 || isTokenExpired()) {
        try {
          this._apiRoot = await refreshTokenIfNeeded();
          await this._apiRoot
            .me()
            .password()
            .post({
              body: {
                version,
                currentPassword,
                newPassword,
              },
            })
            .execute();
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          throw new Error('Session expired. Please login again.');
        }
      } else {
        // Handle specific password change errors
        if (
          error.body?.errors?.[0]?.code === 'InvalidCredentials' ||
          error.body?.errors?.[0]?.code === 'InvalidCurrentPassword'
        ) {
          throw new Error('Неверный текущий пароль');
        }
        throw error;
      }
    }
  }

  async addAddress(version: number, address: any) {
    try {
      const response = await this._apiRoot
        .me()
        .post({
          body: {
            version,
            actions: [
              {
                action: 'addAddress',
                address,
              },
            ],
          },
        })
        .execute();

      return response.body;
    } catch (error: any) {
      if (error.statusCode === 401 || isTokenExpired()) {
        try {
          this._apiRoot = await refreshTokenIfNeeded();
          const response = await this._apiRoot
            .me()
            .post({
              body: {
                version,
                actions: [
                  {
                    action: 'addAddress',
                    address,
                  },
                ],
              },
            })
            .execute();

          return response.body;
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          throw new Error('Session expired. Please login again.');
        }
      }
      throw error;
    }
  }

  async updateAddress(version: number, addressId: string, address: any) {
    try {
      const response = await this._apiRoot
        .me()
        .post({
          body: {
            version,
            actions: [
              {
                action: 'changeAddress',
                addressId,
                address,
              },
            ],
          },
        })
        .execute();

      return response.body;
    } catch (error: any) {
      if (error.statusCode === 401 || isTokenExpired()) {
        try {
          this._apiRoot = await refreshTokenIfNeeded();
          const response = await this._apiRoot
            .me()
            .post({
              body: {
                version,
                actions: [
                  {
                    action: 'changeAddress',
                    addressId,
                    address,
                  },
                ],
              },
            })
            .execute();

          return response.body;
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          throw new Error('Session expired. Please login again.');
        }
      }
      throw error;
    }
  }

  async removeAddress(version: number, addressId: string) {
    try {
      const response = await this._apiRoot
        .me()
        .post({
          body: {
            version,
            actions: [
              {
                action: 'removeAddress',
                addressId,
              },
            ],
          },
        })
        .execute();

      return response.body;
    } catch (error: any) {
      if (error.statusCode === 401 || isTokenExpired()) {
        try {
          this._apiRoot = await refreshTokenIfNeeded();
          const response = await this._apiRoot
            .me()
            .post({
              body: {
                version,
                actions: [
                  {
                    action: 'removeAddress',
                    addressId,
                  },
                ],
              },
            })
            .execute();

          return response.body;
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          throw new Error('Session expired. Please login again.');
        }
      }
      throw error;
    }
  }
}
