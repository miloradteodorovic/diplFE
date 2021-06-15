import React from 'react';
import { Menu } from 'semantic-ui-react'
import { useNavigation } from 'react-navi';
import { logoutUrl } from '../../config';

export function MainMenuComponent() {
    const navigation = useNavigation();

    return (
        <Menu className="menu">
            <Menu.Item className="menuItem"
                name='home'
                // active={activeItem === 'editorials'}
                onClick={() => {
                    navigation.navigate(`/home`);
                }}
            >
                Home
                    </Menu.Item>

            <Menu.Item className="menuItem"
                name='reservations'
                // active={activeItem === 'reviews'}
                onClick={() => {
                    navigation.navigate(`/reservations`);
                }}
            >
                Reservations
                    </Menu.Item>

            <Menu.Item className="menuItem"
                name='sign_out'
                // active={activeItem === 'upcomingEvents'}
                onClick={() => {
                    localStorage.clear();
                    window.location.href = logoutUrl;
                }}
            >
                Sign out
                    </Menu.Item>
        </Menu>
    )
}