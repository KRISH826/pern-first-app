import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./user/userSlice";
import { apiSlice } from "@/lib/apiSlice";
import { publicApiSlice } from "@/lib/publicApiSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth: authReducer,

            // 🔐 Private APIs (JWT required)
            [apiSlice.reducerPath]: apiSlice.reducer,

            // 🌍 Public APIs (no JWT)
            [publicApiSlice.reducerPath]: publicApiSlice.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(
                apiSlice.middleware,
                publicApiSlice.middleware
            ),
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
