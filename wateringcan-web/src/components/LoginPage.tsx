import React from 'react';

import styles from '../styles/LoginPage.module.scss';

const LoginPage = () => {
    return (
        <div className={`container ${styles.loginGrid}`}>
            <div className={styles.loginPanel}>
                <div>
                    <h1>Login</h1>
                </div>
                <div className={styles.fieldRow}>
                    <span>Username:</span>
                    <input type="text" />
                </div>
                <div className={styles.fieldRow}>
                    <span>Password:</span>
                    <input type="text" />
                </div>
                <div className={styles['fieldRow-button']}>
                    <button type="button">Login</button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
