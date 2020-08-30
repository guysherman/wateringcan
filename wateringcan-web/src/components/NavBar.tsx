import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import styles from '../styles/NavBar.module.scss';
import { RootState, AuthenticationState } from 'redux/Types';

const allMenuItems = [
    { title: 'Frameworks', path: '/frameworks', permission: 'framework' },
];


const NavBar = () => {
    
    const { pathname } = useLocation();
    const permittedObjects = useSelector(
        createSelector(
            (state: RootState) => state.authentication,
            (slice: AuthenticationState ) => slice.user!.permittedObjects,
        )
    );

    const menuItems = allMenuItems.filter(
        i => (
            permittedObjects!
                .toLowerCase()
                .includes(i.permission.toLowerCase())
        )
    );

    console.log(location);

    return (
        <div className={styles.navBar}>
            <div className={styles.navBody}>
                <span className={styles.appTitle}>WateringCan</span>
                {
                    menuItems.map(i => (
                        <Link key={i.title} to={i.path}
                            className={pathname.startsWith(i.path) ? styles.menuItemCurrent : styles.menuItem }>
                                {i.title}
                        </Link>
                    ))
                }
            </div>
        </div>
    );
};

export default NavBar;

