import { createApi } from '@reduxjs/toolkit/query/react';

import { createPasswordFlowClient } from '@/commercetools/login';
import { apiAnonRoot } from '@/commercetools/anonUser';

export const commercetoolsApi = createApi({
  reducerPath: 'commercetoolsApi',
  baseQuery: () => ({ data: {} }),
  endpoints: (builder) => ({
    // // 1. Создание корзины для анонимного пользователя
    // createAnonymousCart: builder.mutation({
    //   queryFn: async ({ anonymousId }) => {
    //     const result = await apiRoot.carts().post({
    //       body: { anonymousId },
    //     }).execute();
    //     return { data: result.body };
    //   },
    // }),

    // // 2. Регистрация нового клиента
    createCustomer: builder.mutation({
      queryFn: async (customerDraft) => {
        const result = await apiAnonRoot
          .customers()
          .post({
            body: customerDraft,
          })
          .execute();

        return { data: result.body };
      },
    }),

    // 3. Логин клиента
    login: builder.mutation({
      queryFn: async ({ email, password }) => {
        try {
          const loginClient = createPasswordFlowClient(email, password);
          const result = await loginClient
            .login()
            .post({
              body: { email, password },
            })
            .execute();

          const customer = result.body.customer;

          const userData = {
            id: customer.id,
            email: customer.email,
            firstName: customer.firstName,
            lastName: customer.lastName,
          };

          localStorage.setItem('userData', JSON.stringify(userData));

          const tokens = JSON.parse(localStorage.getItem('authTokens') || '{}');

          if (!tokens.refreshToken) {
            throw new Error('Токены не были сохранены');
          }

          return { data: { customer, tokens } };
        } catch (error) {
          return {
            error: {
              status: 400,
              data: { message: 'Неверный логин или пароль' },
            },
          };
        }
      },
    }),

    //   // 4. Получение текущего клиента (для зарегистрированных пользователей)
    //   getMe: builder.query({
    //     queryFn: async () => {
    //       const result = await apiRoot.me().get().execute();
    //       return { data: result.body };
    //     },
    //   }),
  }),
});

export const { useLoginMutation, useCreateCustomerMutation } = commercetoolsApi;
