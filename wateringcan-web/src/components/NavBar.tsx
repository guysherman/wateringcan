import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { apiUrl } from '../config';
import LoginController, { User, ILoginController } from '../controllers/LoginController';

import styles from '../styles/NavBar.module.scss';

const allMenuItems = [
    { title: 'Frameworks', path: '/frameworks', permission: 'framework' },
];


const NavBar = () => {
    
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

    // Have to update this to use redux, not context
    // useEffect(() => {
    //     controller.getPermittedObjects(user.id!).then((response: User) => {
    //         switch (response.state) {
    //             case 'error':
    //                 console.log(response);
    //                 break;
    //             case 'success':
    //                 // eslint-disable-next-line no-console
    //                 updateMenuBar(response.response.permittedObjects);
    //                 break;
    //             default:
    //                 console.log('Unknown error');
    //         }
    //     });
    // }, [user]);

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

