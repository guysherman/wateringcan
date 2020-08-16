import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import NavBar from './NavBar';
import FrameworksPage from './FrameworksPage';
import DummyPage from './DummyPage';
import styles from '../styles/Page.module.scss';


const Page = () => {
    return (
        <div className={styles.pageContainer}>
            <Router>
                <NavBar />
                <Route exact path="/frameworks" component={FrameworksPage} />
                <Route exact path="/" component={DummyPage} />
            </Router>
        </div>
    );
};

export default Page;
