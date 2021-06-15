import React, { useState, useEffect } from 'react'
import { toastSuccess } from '../../components/ToastComponent';
import { useNavigation } from 'react-navi';
import { getUser, updateUser } from '../../network/requests';
import { CircularProgress } from '@material-ui/core';
import { AdminMainMenuComponent } from '../../components/menu/AdminMainMenu';
import Select from "react-dropdown-select";

interface EditUserProps {
    userId: string;
}

interface User {
    id: string;
    email: string;
    role: string;
    password?: string;
}

export function EditUser({ userId }: EditUserProps) {
    const navigation = useNavigation();
    const [role, setRole] = useState('');
    const [user, setUser] = useState<User>({ id: '', email: '', role: '' });
    const [showErrorMsg, setShowErrorMsg] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            const userResult = await getUser(userId);
            setUser({
                id: userResult.username,
                email: userResult.email,
                role: userResult.role
            });
        }
        fetchUser()
    }, [])

    useEffect(() => {
        setRole(user.role)
    }, [user, setUser])

    useEffect(() => {
        if (role !== '' && showErrorMsg) {
            setShowErrorMsg(false);
        }
    }, [role, setShowErrorMsg, showErrorMsg])

    if (!user || user === undefined) {
        return <div className="centerLoader">
            <CircularProgress />
        </div>;
    }

    const options = [
        {
            value: 'SuperAdmin',
            label: 'Super admin',
        },
        {
            value: 'Admin',
            label: 'Admin',
        },
        {
            value: 'User',
            label: 'User',
        }
    ]

    return (
        <div>
            <AdminMainMenuComponent />
            <div className="container">
                <div className="addCityCard">
                    <Select options={options} values={options} onChange={(values) => {
                        setRole(values[0].value)
                    }} />
                    {showErrorMsg ?
                        <label className="adminErrorLabel">Please select role.</label> : null}
                    <br />
                    <br />
                    <br />
                    <button className="addCityButton" onClick={async () => {
                        if (role === '') {
                            setShowErrorMsg(true)
                        } else {
                            await updateUser(userId, role);
                            toastSuccess(`Updated user!`)
                            navigation.navigate('/admin/users')
                        }
                    }}>Save changes</button>
                </div>
            </div>
        </div>
    );
}