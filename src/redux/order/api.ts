import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { OrderInfo } from './types';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    sendRequest: builder.mutation<{ id: number }, FormData>({
      queryFn: () => ({ data: { id: Date.now() } }),
    }),
    getMyOrders: builder.query<OrderInfo[], void>({
      queryFn: () => ({ data: [] }),
      providesTags: ['Orders'],
    }),
    uploadCheque: builder.mutation<
      OrderInfo,
      { user_id: number; order_id: number; file: File }
    >({
      queryFn: () => ({
        error: {
          status: 'DEMO_MODE',
          data: { message: 'Payments will be connected with the new backend.' },
        },
      }),
    }),
    markTasksRead: builder.mutation<void, { order_id: number }>({
      queryFn: () => ({ data: undefined }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

export const {
  useSendRequestMutation,
  useGetMyOrdersQuery,
  useUploadChequeMutation,
  useMarkTasksReadMutation,
} = orderApi;
