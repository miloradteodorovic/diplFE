import React, { useEffect, useState } from 'react';
import { getTheaters, deleteTheater } from '../../network/requests';
import { useNavigation } from 'react-navi';
import { Button, CircularProgress } from '@material-ui/core';
import { toastSuccess } from '../ToastComponent';
import { AdminMainMenuComponent } from '../../components/menu/AdminMainMenu';
import { removeArrayItem } from '../../util';

interface Theater {
    id: string;
    name: string;
    iconSrc: string;
}

export function ManageTheaters() {
    const [theaters, setTheaters] = useState<Array<Theater>>();
    const navigation = useNavigation();
    useEffect(() => {
        async function fetchTheaters() {
            const theatersResult = await getTheaters();
            const mappedTheaters: Array<Theater> = theatersResult.map((theater) =>
                ({
                    id: theater.id,
                    name: theater.name,
                    iconSrc: theater.image_uri,
                }))
            setTheaters(mappedTheaters);
        }
        fetchTheaters()
    }, [theaters, setTheaters])

    if (!theaters || theaters === undefined) {
        return <div className="centerLoader">
            <CircularProgress />
        </div>;
    }

    const theaterItems = theaters.map((theater) => {
        return <div className="adminTheaterCard" key={theater.id}>
            <img className="adminCardImage" height={200} width={100} onClick={() => {
                navigation.navigate(`theater/${theater.name.toLowerCase()}/${theater.id}`);
            }} src={theater.iconSrc} alt={theater.name} />
            <h4><b>{theater.name}</b></h4><br /><br />
            <div className="adminCardButtonContainer">
                <Button className="adminCardButton" onClick={async () => {
                    navigation.navigate(`/admin/edit-theater/${theater.id}`)
                }}>Edit</Button>
                <Button className="adminCardButton" onClick={async () => {
                    await deleteTheater(theater.id);
                    const newTheaters: Array<Theater> = removeArrayItem(theaters, theater);
                    setTheaters(newTheaters);
                    toastSuccess('Successfully deleted theater!');
                }}>Delete</Button>
                <Button className="adminCardButton" onClick={async () => {
                    navigation.navigate(`theater/${theater.name}/${theater.id}`)
                }}>Manage</Button>
            </div>
        </div>
    })


    return (
        <div>
            <AdminMainMenuComponent />
            <div className="container">
                <Button className="defaultButton" onClick={() => {
                    navigation.navigate('/add-theater')
                }}>Add new theater</Button>
                <div className="container-horizontal">
                    {theaterItems}
                </div>
            </div>
        </div>
    );
}