import React from 'react';


import styles from '../styles/Page.module.scss';

const DummyPage = () => {
    return (
        <div className={styles.bodyContainer}>
            <div className={styles.bodyContent}>
                <h1>Hello World</h1>
            </div>
        </div>
    );
};

export default DummyPage;
