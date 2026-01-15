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
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<AuthState['user']>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isLoading = false;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        }
    }
})

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;