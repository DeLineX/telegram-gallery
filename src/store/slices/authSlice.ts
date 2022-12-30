import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface AuthState {
    isAuthorized: boolean;
    qrLoginLink: string | null;
}

const initialState: AuthState = {
    isAuthorized: false,
    qrLoginLink: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setQrLink: (state, action: PayloadAction<string>) => {
            state.qrLoginLink = action.payload;
        },
        login: state => {
            state.isAuthorized = true;
        },
        logout: state => {
            state.isAuthorized = false;
        },
    },
});

export const { setQrLink, login, logout } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export const authReducer = authSlice.reducer;
