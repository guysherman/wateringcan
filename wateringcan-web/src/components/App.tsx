import React from 'react';
import { useImmer } from 'use-immer';

import { LoginState } from '../controllers/LoginController';

import Page from './Page';
import LoginPage from './LoginPage';

import '../styles/index.scss';

interface IAppContext {
    user: LoginState,
    updateLogin: Function
}

const appContext : IAppContext = { user: {}, updateLogin: () => {} };
export const AppContext = React.createContext(appContext);

const App = () => {
    const emptyLogin: LoginState = {};
    const loginData : LoginState = JSON.parse(localStorage.getItem('loginData') || 'null') || emptyLogin;
    const [user, updateUser] = useImmer(loginData);

    const updateLogin = (loginState: LoginState) => {
        localStorage.setItem('loginData', JSON.stringify(loginState));
        updateUser((draft) => {
            return { ...draft, ...loginState };
        });
    };

    return (
        <AppContext.Provider value={{ user, updateLogin }}>
            { user.token ? <Page /> : <LoginPage />}
        </AppContext.Provider>
    );
};

export default App;
