// store/user/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    user: {
        cognitoSub: string;
        email: string;
        name: string;
        role: 'tenant' | 'manager';
    } | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean; // Add this
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isInitialized: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<AuthState['user']>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.isInitialized = true;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.isInitialized = true;
        },
    }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;