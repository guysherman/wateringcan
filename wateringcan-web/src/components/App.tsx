import React from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import Page from './Page';
import LoginPage from './LoginPage';

import '../styles/index.scss';
import { RootState } from 'redux/Types';

const App = () => {
    const isLoggedIn = useSelector(
        createSelector(
            (state: RootState) => state.authentication,
            (auth) => auth.isLoggedIn,
        )
    );

    return (
        isLoggedIn ? <Page /> : <LoginPage />
    );
};

export default App;
