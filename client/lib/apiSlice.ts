import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { fetchAuthSession } from 'aws-amplify/auth';

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
    prepareHeaders: async (headers) => {
        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.idToken?.toString();
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
        } catch (error) {
            console.log('Auth Error', error)
        }

        return headers;
    }
})

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery,
    tagTypes: ['Tenant', 'Manager'],
    endpoints: (builder) => ({
        createTenant: builder.mutation({
            query: (data) => ({
                url: '/tenants',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Tenant']
        }),
        createManager: builder.mutation({
            query: (data) => ({
                url: '/managers',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Manager']
        }),
        getTenant: builder.query({
            query: (cognito_sub) => `/tenants/${cognito_sub}`,
            providesTags: ['Tenant']
        }),
        getManager: builder.query({
            query: (cognito_sub) => `/managers/${cognito_sub}`,
            providesTags: ['Manager']
        })
    })
})

export const {
    useCreateTenantMutation,
    useGetTenantQuery,
    useCreateManagerMutation,
    useGetManagerQuery,
} = apiSlice;