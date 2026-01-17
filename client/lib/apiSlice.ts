import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession } from "aws-amplify/auth";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
    prepareHeaders: async (headers) => {
        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.idToken?.toString();

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
        } catch (err) {
            console.error("Auth session error", err);
        }

        return headers;
    },
});

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery,
    tagTypes: ["Tenant", "Manager"],
    endpoints: (builder) => ({
        getTenantMe: builder.query<unknown, void>({
            query: () => "/tenants/me",
            providesTags: ["Tenant"],
        }),

        getManagerMe: builder.query<unknown, void>({
            query: () => "/managers/me",
            providesTags: ["Manager"],
        }),

        createTenant: builder.mutation<unknown, { name: string; email: string }>({
            query: (body) => ({
                url: "/tenants",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Tenant"],
        }),

        createManager: builder.mutation<unknown, { name: string; email: string }>({
            query: (body) => ({
                url: "/managers",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Manager"],
        }),
    }),
});

export const {
    useLazyGetTenantMeQuery,
    useLazyGetManagerMeQuery,
    useCreateTenantMutation,
    useCreateManagerMutation,
} = apiSlice;
