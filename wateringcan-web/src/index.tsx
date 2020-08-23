import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import App from './components/App';
import Store from './redux/Store';

ReactDOM.render(
    <CookiesProvider>
        <Provider store={Store}>
            <App />
        </Provider>
    </CookiesProvider>,
    document.getElementById('root')
);
