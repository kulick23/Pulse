import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
  GetRegistrationCodeDto,
  UpdatePasswordDto,
  TokenResponseDto,
  UserDto,
} from './dto';
import { getObject, STORAGE_KEYS } from '../../utils';

const buildDemoAuthResponse = (email: string): AuthResponseDto => ({
  access_token: 'pulse-demo-access-token',
  refresh_token: 'pulse-demo-refresh-token',
  user: {
    id: '1',
    email,
    firstName: 'Pulse',
    lastName: 'User',
    role: 'client',
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
});

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getCurrentUser: builder.query<UserDto, void>({
      queryFn: () => {
        const user = getObject<UserDto>(STORAGE_KEYS.USER_DATA);
        return user
          ? { data: user }
          : { error: { status: 401, data: { message: 'Demo session is empty' } } };
      },
    }),

    getRegistrationCode: builder.mutation<void, GetRegistrationCodeDto>({
      queryFn: () => ({ data: undefined }),
    }),

    register: builder.mutation<AuthResponseDto, RegisterDto>({
      queryFn: (userData) => ({
        data: buildDemoAuthResponse(userData.email),
      }),
    }),

    login: builder.mutation<AuthResponseDto, LoginDto>({
      queryFn: (credentials) => ({
        data: buildDemoAuthResponse(credentials.email),
      }),
    }),

    refreshTokens: builder.mutation<TokenResponseDto, void>({
      queryFn: () => ({
        data: {
          access_token: 'pulse-demo-access-token',
          refresh_token: 'pulse-demo-refresh-token',
        },
      }),
    }),

    getRecoveryCode: builder.mutation<void, string>({
      queryFn: () => ({ data: undefined }),
    }),

    updatePassword: builder.mutation<void, UpdatePasswordDto>({
      queryFn: () => ({ data: undefined }),
    }),

    logout: builder.mutation<void, void>({
      queryFn: () => ({ data: undefined }),
    }),
  }),
});

export const {
  useGetRegistrationCodeMutation,
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokensMutation,
  useGetRecoveryCodeMutation,
  useUpdatePasswordMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
} = authApi;
