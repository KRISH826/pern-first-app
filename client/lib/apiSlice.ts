import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession } from "aws-amplify/auth";

const authBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
    prepareHeaders: async (headers) => {
        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.idToken?.toString();

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
        } catch (error) {
            console.log("Auth Error", error);
        }

        return headers;
    },
});

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: authBaseQuery,
    tagTypes: ["Tenant", "Manager"],
    endpoints: (builder) => ({
        getTenant: builder.query({
            query: (cognitoSub: string) => `/tenants/${cognitoSub}`,
            providesTags: ["Tenant"],
        }),

        getManager: builder.query({
            query: (cognitoSub: string) => `/managers/${cognitoSub}`,
            providesTags: ["Manager"],
        }),
    }),
});

export const {
    useGetTenantQuery,
    useGetManagerQuery,
} = apiSlice;
