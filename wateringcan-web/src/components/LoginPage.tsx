import React from 'react';
import { useImmer } from 'use-immer';
import { unwrapResult } from '@reduxjs/toolkit';

import { AppDispatch, useAppDispatch } from '../redux/Store';
import { doLogin } from '../redux/slices/AuthenticationSlice';

import styles from '../styles/LoginPage.module.scss';

interface LoginForm {
    email: string | null,
    password: string | null,
    errorMessage: string | null,
    loading: boolean,
}

const LoginPage = () => {
    const initialLoginForm: LoginForm = {
        email: null,
        password: null,
        errorMessage: null,
        loading: false,
    };

    const [loginForm, updateLoginForm] = useImmer(initialLoginForm);

    const dispatch: AppDispatch = useAppDispatch();

    const setErrorMessage = (errorMessage: string) => {
        updateLoginForm((draft) => {
            draft.errorMessage = errorMessage;
            draft.loading = false;
        });
    };

    const setLoading = (isLoading: boolean) => {
        updateLoginForm((draft) => {
            draft.loading = isLoading;
        });
    };

    const emailChanged = (event: React.FormEvent<HTMLInputElement>) => {
        const email: string = event.currentTarget.value;
        updateLoginForm((draft) => {
            draft.email = email;
        });
    };

    const passwordChanged = (event: React.FormEvent<HTMLInputElement>) => {
        const password: string = event.currentTarget.value;
        updateLoginForm((draft) => {
            draft.password = password;
        });
    };

    const loginClicked = async () => {
        if (!(loginForm.email && loginForm.password)) {
            setErrorMessage('You must enter both a username and a password');
        } else {
            try {
                setLoading(true);
                const action = await dispatch(
                    doLogin({ email: loginForm.email, password: loginForm.password }),
                );
                unwrapResult(action);
            } catch (err) {
                setErrorMessage('Email or password incorrect');
            }
        }
    };

    return (
        <div className={`container ${styles.loginGrid}`}>
            <div className={styles.loginPanel}>
                <div>
                    <h1>Login</h1>
                </div>
                <label className={styles.fieldRow} htmlFor="email">
                    Email:
                    <input id="email" type="text" onChange={emailChanged} size={17} />
                </label>
                <label className={styles.fieldRow} htmlFor="password">
                    Password:
                    <input id="password" type="password" onChange={passwordChanged} size={17} />
                </label>
                <div className={styles['fieldRow-button']}>
                    <span className={styles.errorMessage}>{loginForm.errorMessage}</span>
                    <button type="button" onClick={loginClicked} disabled={loginForm.loading}>Login</button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
