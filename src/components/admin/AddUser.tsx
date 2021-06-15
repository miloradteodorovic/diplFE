import React, { useState, useEffect } from 'react'
import { toastSuccess } from '../../components/ToastComponent';
import { useNavigation } from 'react-navi';
import { addUser } from '../../network/requests';
import Select from "react-dropdown-select";
import { AdminMainMenuComponent } from '../../components/menu/AdminMainMenu';

export function AddAdminUser() {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [showErrorMsg, setShowErrorMsg] = useState(false);

    useEffect(() => {
        if (email !== '' && (password !== '' || password.length < 6) && role !== '' && showErrorMsg) {
            setShowErrorMsg(false);
        }
    }, [email, password, role, setShowErrorMsg, showErrorMsg])

    const navigation = useNavigation();

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
                    <label>Email:</label><br />
                    <input type="email" id="fname" name="fname" onChange={(event) => {
                        setEmail(event.target.value);
                    }}></input><br /><br /><br />
                    <label>Password:</label><br />
                    <input type="password" id="fpass" name="fpass" onChange={(event) => {
                        setPassword(event.target.value);
                    }}></input><br /><br /><br />
                    <Select options={options} values={options} onChange={(values) => {
                        setRole(values[0].value)
                    }} />
                    {showErrorMsg ?
                        <label className="adminErrorLabel">Please provide email, valid password and role for new user.</label> : null}
                    <br />
                    <br />
                    <br />
                    <button className="addCityButton" onClick={async () => {
                        if (email === '' || password === '') {
                            setShowErrorMsg(true)
                        } else {
                            await addUser(email, password, role);
                            toastSuccess(`Added new user!`)
                            navigation.navigate('/admin/users')
                        }
                    }}>Add user</button>
                </div>
            </div>
        </div>
    );
}