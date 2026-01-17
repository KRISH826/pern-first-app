import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "tenant" | "manager";

interface User {
    email: string;
    name: string;
    role: UserRole;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isInitialized: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isInitialized = true;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isInitialized = true;
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
