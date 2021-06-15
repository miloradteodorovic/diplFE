import { loginUrl } from '../config';
import React from 'react';

export function Login() {
    window.location.href = loginUrl;
    return <div></div>;
}