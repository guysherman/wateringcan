import React from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import Page from './Page';
import LoginPage from './LoginPage';

import '../styles/index.scss';

const App = () => {
    const isLoggedIn = useSelector(
        createSelector(
            (state) => state.authentication,
            (auth) => auth.isLoggedIn,
        )
    );

    return (
        isLoggedIn ? <Page /> : <LoginPage />
    );
};

export default App;
