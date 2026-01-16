import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const publicApiSlice = createApi({
    reducerPath: "publicApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
    }),
    endpoints: (builder) => ({
        signupTenant: builder.mutation({
            query: (data) => ({
                url: "/tenants",
                method: "POST",
                body: data,
            }),
        }),

        signupManager: builder.mutation({
            query: (data) => ({
                url: "/managers",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const {
    useSignupTenantMutation,
    useSignupManagerMutation,
} = publicApiSlice;
