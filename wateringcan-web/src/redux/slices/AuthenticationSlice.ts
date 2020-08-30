import { createSlice, createAsyncThunk, SerializedError } from '@reduxjs/toolkit';

import { apiUrl } from '../../config';
import LoginController, { User } from '../../controllers/LoginController';

const loginController: LoginController = new LoginController(apiUrl);

export interface AuthenticationState {
    user?: User;
    requestStatus: 'idle' | 'loading' | 'success' | 'failure';
    isLoggedIn: boolean;
    error?: SerializedError;
}

const initialState: AuthenticationState = JSON.parse(localStorage.getItem('authentication/initialState') || 'null') || {
    requestStatus: 'idle',
    isLoggedIn: false,
};

export const doLogin = createAsyncThunk(
    'autentication/login',
    async ({email, password}: { email: string, password: string }) => {
        const user = await loginController.login(email, password);
        return user;
    }
);

const AuthenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(doLogin.pending, (state) => {
            state.requestStatus = 'loading';
            localStorage.setItem('authentication/initialState', 'null');
        });
        builder.addCase(doLogin.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true;
            state.requestStatus = 'success';
            localStorage.setItem('authentication/initialState', JSON.stringify(state));
        });
        builder.addCase(doLogin.rejected, (state, action) => {
            state.requestStatus = 'failure';
            state.error = action.error;
            localStorage.setItem('authentication/initialState', 'null');
        });
    }
});

export default AuthenticationSlice.reducer;
