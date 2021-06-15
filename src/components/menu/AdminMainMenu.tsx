import React from 'react';
import { Menu } from 'semantic-ui-react'
import { useNavigation } from 'react-navi';
import { logoutUrl } from '../../config';

export function AdminMainMenuComponent() {
    const navigation = useNavigation();

    return (
        <Menu className="adminMenu">
            <Menu.Item
                name='home'
                // active={activeItem === 'editorials'}
                onClick={() => {
                    navigation.navigate(`/home`);
                }}
            >
                Home
                    </Menu.Item>

            <Menu.Item
                name='cities'
                // active={activeItem === 'reviews'}
                onClick={() => {
                    navigation.navigate(`/admin/actors`);
                }}
            >
                Manage actors
                    </Menu.Item>

            <Menu.Item
                name='cities'
                // active={activeItem === 'reviews'}
                onClick={() => {
                    navigation.navigate(`/admin/cities`);
                }}
            >
                Manage cities
                    </Menu.Item>

            <Menu.Item
                name='theaters'
                // active={activeItem === 'reviews'}
                onClick={() => {
                    navigation.navigate(`/admin/theaters`);
                }}
            >
                Manage theaters
            </Menu.Item>

            <Menu.Item
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