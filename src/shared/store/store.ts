import { configureStore } from '@reduxjs/toolkit';

import { commercetoolsApi } from './loginApi';

export const store = configureStore({
  reducer: {
    [commercetoolsApi.reducerPath]: commercetoolsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(commercetoolsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
