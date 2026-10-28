import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './auth';
import { authApi } from './auth/api';
import { orderApi } from './order/api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    // Здесь можно добавить другие редьюсеры для разных фич приложения
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Для работы с не сериализуемыми данными
    })
      .concat(authApi.middleware)
      .concat(orderApi.middleware),
});

// Типы для корневого стейта и диспатча
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
