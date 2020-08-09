import React, { useContext } from 'react';
import { useImmer } from 'use-immer';

import { apiUrl } from '../config';
import { AppContext } from './App';

import LoginController, { LoginResponse, ILoginController } from '../controllers/LoginController';

import styles from '../styles/LoginPage.module.scss';

interface LoginForm {
    email: string | null,
    password: string | null,
    errorMessage: string | null,
}

const LoginPage = () => {
    const appContext = useContext(AppContext);
    const controller : ILoginController = new LoginController(apiUrl);

    const initialLoginForm: LoginForm = {
        email: null,
        password: null,
        errorMessage: null,
    };
    const [loginForm, updateLoginForm] = useImmer(initialLoginForm);

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
            updateLoginForm((draft) => {
                draft.errorMessage = 'You must enter both a username and a password';
            });
        } else {
            const response : LoginResponse = await controller.login(
                loginForm.email,
                loginForm.password,
            );
            switch (response.state) {
            case 'error':
                updateLoginForm((draft) => {
                    draft.errorMessage = response.errorMessage;
                });
                break;
            case 'success':
                // eslint-disable-next-line no-console
                console.log(response);
                appContext.updateLogin(response);
                break;
            default:
                updateLoginForm((draft) => {
                    draft.errorMessage = 'Unknown Error';
                });
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
                    <input id="email" type="text" onChange={emailChanged} />
                </label>
                <label className={styles.fieldRow} htmlFor="password">
                    Password:
                    <input id="password" type="password" onChange={passwordChanged} />
                </label>
                <div className={styles['fieldRow-button']}>
                    <span className={styles.errorMessage}>{loginForm.errorMessage}</span>
                    <button type="button" onClick={loginClicked}>Login</button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
