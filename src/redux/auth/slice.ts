import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDto } from './dto';
import { AuthState, ServerError } from './types';
import { authApi } from './api';
import {
  getItem,
  getObject,
  setItem,
  setObject,
  clearAuthData,
  saveAuthData,
  STORAGE_KEYS,
} from '../../utils/storage';

const initialState: AuthState = {
  user: getObject<UserDto>(STORAGE_KEYS.USER_DATA),
  token: getItem(STORAGE_KEYS.ACCESS_TOKEN),
  refreshToken: getItem(STORAGE_KEYS.REFRESH_TOKEN),
  isLoading: false,
  error: null,
  isAuthenticated: !!getItem(STORAGE_KEYS.ACCESS_TOKEN),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    setUser: (state, action: PayloadAction<UserDto>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      setObject(STORAGE_KEYS.USER_DATA, action.payload);
    },

    setTokens: (
      state,
      action: PayloadAction<{ access_token: string; refresh_token: string }>
    ) => {
      state.token = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
      state.isAuthenticated = true;
      setItem(STORAGE_KEYS.ACCESS_TOKEN, action.payload.access_token);
      setItem(STORAGE_KEYS.REFRESH_TOKEN, action.payload.refresh_token);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      clearAuthData();
    },
  },
  extraReducers: (builder) => {
    // Регистрация - получение кода
    builder.addMatcher(
      authApi.endpoints.getRegistrationCode.matchPending,
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      authApi.endpoints.getRegistrationCode.matchFulfilled,
      (state) => {
        state.isLoading = false;
      }
    );
    builder.addMatcher(
      authApi.endpoints.getRegistrationCode.matchRejected,
      (state, action) => {
        state.isLoading = false;
        if (action.error.name === 'FetchError') {
          state.error =
            'Ошибка сети при запросе кода. Проверьте подключение к интернету или доступность сервера.';
        } else {
          const serverError = action.payload as ServerError;
          state.error =
            serverError?.data?.message ||
            'Не удалось отправить код регистрации';
        }
      }
    );

    // Регистрация пользователя
    builder.addMatcher(authApi.endpoints.register.matchPending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addMatcher(
      authApi.endpoints.register.matchFulfilled,
      (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.isAuthenticated = true;
        saveAuthData(
          action.payload.access_token,
          action.payload.refresh_token,
          action.payload.user
        );
      }
    );
    builder.addMatcher(
      authApi.endpoints.register.matchRejected,
      (state, action) => {
        state.isLoading = false;
        const serverError = action.payload as ServerError;
        state.error = serverError?.data?.message || 'Ошибка регистрации';
      }
    );

    // Вход в систему
    builder.addMatcher(authApi.endpoints.login.matchPending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.isAuthenticated = true;
        saveAuthData(
          action.payload.access_token,
          action.payload.refresh_token,
          action.payload.user
        );
      }
    );
    builder.addMatcher(
      authApi.endpoints.login.matchRejected,
      (state, action) => {
        state.isLoading = false;
        const serverError = action.payload as ServerError;
        state.error = serverError?.data?.message || 'Неверные учетные данные';
      }
    );

    // Выход из системы
    builder.addMatcher(authApi.endpoints.logout.matchPending, (state) => {
      state.isLoading = true;
    });
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
      state.isLoading = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      clearAuthData();
    });
    builder.addMatcher(
      authApi.endpoints.logout.matchRejected,
      (state, action) => {
        state.isLoading = false;
        const serverError = action.payload as ServerError;
        state.error =
          serverError?.data?.message || 'Ошибка при выходе из системы';
      }
    );

    // Получение кода восстановления
    builder.addMatcher(
      authApi.endpoints.getRecoveryCode.matchPending,
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      authApi.endpoints.getRecoveryCode.matchFulfilled,
      (state) => {
        state.isLoading = false;
      }
    );
    builder.addMatcher(
      authApi.endpoints.getRecoveryCode.matchRejected,
      (state, action) => {
        state.isLoading = false;
        const serverError = action.payload as ServerError;
        state.error =
          serverError?.data?.message ||
          'Не удалось отправить код восстановления';
      }
    );

    // Обновление пароля
    builder.addMatcher(
      authApi.endpoints.updatePassword.matchPending,
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      authApi.endpoints.updatePassword.matchFulfilled,
      (state) => {
        state.isLoading = false;
      }
    );
    builder.addMatcher(
      authApi.endpoints.updatePassword.matchRejected,
      (state, action) => {
        state.isLoading = false;
        const serverError = action.payload as ServerError;
        state.error = serverError?.data?.message || 'Ошибка обновления пароля';
      }
    );

    // Обновление токенов
    builder.addMatcher(
      authApi.endpoints.refreshTokens.matchFulfilled,
      (state, action) => {
        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.isAuthenticated = true;
        setItem(STORAGE_KEYS.ACCESS_TOKEN, action.payload.access_token);
        setItem(STORAGE_KEYS.REFRESH_TOKEN, action.payload.refresh_token);
      }
    );
    builder.addMatcher(
      authApi.endpoints.refreshTokens.matchRejected,
      (state, action) => {
        const serverError = action.payload as ServerError;
        if (serverError?.status === 401) {
          state.token = null;
          state.refreshToken = null;
          state.isAuthenticated = false;
          clearAuthData();
        }
      }
    );

    // Получение текущего пользователя
    builder.addMatcher(
      authApi.endpoints.getCurrentUser.matchFulfilled,
      (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        setObject(STORAGE_KEYS.USER_DATA, action.payload);
      }
    );
    builder.addMatcher(
      authApi.endpoints.getCurrentUser.matchRejected,
      (state, action) => {
        const err = action.payload as ServerError;
        // при 401 — реальный выход
        if (err?.status === 401) {
          state.user = null;
          state.token = null;
          state.refreshToken = null;
          state.isAuthenticated = false;
          clearAuthData();
        }
        // при прочих ошибках — просто флаг загрузки в false
        state.isLoading = false;
      }
    );
  },
});

export const { clearError, setUser, setTokens, logout } = authSlice.actions;
export default authSlice.reducer;
