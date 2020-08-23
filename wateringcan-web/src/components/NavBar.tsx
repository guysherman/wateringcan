import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { apiUrl } from '../config';
import { AppContext } from './App';
import LoginController, { ApiResponse, ILoginController } from '../controllers/LoginController';


import styles from '../styles/NavBar.module.scss';

const allMenuItems = [
    { title: 'Frameworks', path: '/frameworks', permission: 'framework' },
];


const NavBar = () => {
    const { user } = useContext(AppContext);
    const controller : ILoginController = new LoginController(apiUrl, user);
    const [menuItems, setMenuItems] = useState([{ title: 'Loading...', path: '#', permission: '' }]);
    const { pathname } = useLocation();

    console.log(location);

    const updateMenuBar = (permittedObjects: string) => {
        const newMenuItems = allMenuItems.filter(
            i => (
                permittedObjects
                    .toLowerCase()
                    .includes(i.permission.toLowerCase())
            )
        );
        setMenuItems(newMenuItems);
    };

    useEffect(() => {
        controller.getPermittedObjects(user.id!).then((response: ApiResponse) => {
            switch (response.state) {
                case 'error':
                    console.log(response);
                    break;
                case 'success':
                    // eslint-disable-next-line no-console
                    updateMenuBar(response.response.permittedObjects);
                    break;
                default:
                    console.log('Unknown error');
            }
        });
    }, [user]);

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

