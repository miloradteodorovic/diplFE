import React from 'react';
import '../../styles/index_admin.css'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

import { logoutUrl } from '../../config'
import { useNavigation } from 'react-navi';

interface AdminHomeProps {
    isSuperAdmin: boolean;
}

export function AdminHome({ isSuperAdmin }: AdminHomeProps) {
    const navigation = useNavigation();
    return <div className='container'>
       <h2>Welcome, Super Admin</h2><br /><br /><br /> 

        {isSuperAdmin ? <button className='homeButton' onClick={() => {
            navigation.navigate('admin/users')
        }}>Manage users</button> : null}
        <button className='homeButton' onClick={() => {
            navigation.navigate('admin/actors')
        }}>Manage actors</button>
        <button className='homeButton' onClick={() => {
            navigation.navigate('/admin/cities');
        }}>Manage cities</button>
        <button className='homeButton' onClick={() => {
            navigation.navigate('/admin/theaters');
        }}>Manage theaters</button>
        <button className='homeButton' onClick={() => {
            localStorage.clear();
            window.location.href = logoutUrl;
        }} >Sign out</button>
    </div>
}