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

const initialState: AuthenticationState = {
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
        });
        builder.addCase(doLogin.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true;
            state.requestStatus = 'idle';
        });
        builder.addCase(doLogin.rejected, (state, action) => {
            state.requestStatus = 'idle';
            state.error = action.error;
        });
    }
});

export default AuthenticationSlice.reducer;
