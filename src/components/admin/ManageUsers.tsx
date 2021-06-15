import React, { useEffect, useState } from 'react';
import { getCities, deleteCity, getUsers, deleteUser } from '../../network/requests';
import { useNavigation } from 'react-navi';
import { Button, CircularProgress } from '@material-ui/core';
import { toastSuccess } from '../../components/ToastComponent';
import { AdminMainMenuComponent } from '../../components/menu/AdminMainMenu';
import { removeArrayItem } from '../../util';

interface User {
    id: string;
    role: string;
    email: string;
}

export function ManageUsers() {
    const [users, setUsers] = useState<Array<User>>();
    const navigation = useNavigation();
    useEffect(() => {
        async function fetchUsers() {
            const usersResult = await getUsers();
            const users: Array<User> = usersResult.map((user) =>
                ({
                    id: user.username,
                    role: user.role,
                    email: user.email,
                }))
            setUsers(users);
        }
        fetchUsers()
    }, [users, setUsers])

    if (!users || users === undefined) {
        return <div className="centerLoader">
            <CircularProgress />
        </div>;
    }

    const userItems = users.map((user) => {
        return <div className="adminUserCard" key={user.id}>
            <h4><b>{user.email}</b></h4>
            <div className="container-horizontal">
                <p>Role: </p>
                <p>{user.role}</p>
                {user.role !== 'SuperAdmin' ?
                    <div>
                        <Button className="adminCardButton" onClick={async () => {
                            navigation.navigate(`/admin/edit-user/${user.id}`);
                        }}>Edit</Button>
                        <Button className="adminCardButton" onClick={async () => {
                            await deleteUser(user.id);
                            const newArr: Array<User> = removeArrayItem(users, user);
                            setUsers(newArr);
                            toastSuccess('Successfully deleted user!');
                        }}>Delete</Button>
                    </div> : null}
            </div>
        </div>
    })

    return (
        <div>
            <AdminMainMenuComponent />
            <div className="container">
                <Button className="defaultButton" onClick={() => {
                    navigation.navigate('/admin/add-user')
                }}>Add new user</Button>
                {userItems}
            </div>
        </div>
    );
}