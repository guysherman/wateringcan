import React from 'react';

import styles from '../styles/Page.module.scss';

const Page = () => {
    return (
        <div className={styles.pageContainer}>
            <div className={styles.navBar}>
                <div className={styles.navBody}>
                    <span className={styles.appTitle}>WateringCan</span>
                </div>
            </div>
            <div className={styles.bodyContainer}>
                <div className={styles.bodyContent}>
                    <h1>Hello World</h1>
                </div>
            </div>
        </div>
    );
};

export default Page;
