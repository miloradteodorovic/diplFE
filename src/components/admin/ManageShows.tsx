import React, { useEffect, useState } from 'react';
import { getShowsForTheater, deleteShow } from '../../network/requests';
import { useNavigation } from 'react-navi';
import { Button, CircularProgress } from '@material-ui/core';
import { toastSuccess } from '../ToastComponent';
import { AdminMainMenuComponent } from '../../components/menu/AdminMainMenu';
import { removeArrayItem } from '../../util';

interface Show {
    id: string;
    name: string;
    description: string;
    iconSrc: string;
}

export interface ManageShowsProps {
    theaterName: string;
    theaterId: string;
}

export function ManageShows({ theaterName, theaterId }: ManageShowsProps) {
    const [shows, setShows] = useState<Array<Show>>();
    const navigation = useNavigation();
    useEffect(() => {
        async function fetchShows() {
            const showsResult = await getShowsForTheater(theaterId);
            const mappedShows: Array<Show> = showsResult.map((show) =>
                ({
                    id: show.id,
                    name: show.name,
                    description: show.description,
                    iconSrc: show.image_uri,
                }))
            setShows(mappedShows);
        }
        fetchShows()
    }, [shows, setShows])

    if (!shows || shows === undefined) {
        return <div className="centerLoader">
            <CircularProgress />
        </div>;
    }

    const showItems = shows.map((show) => {
        return <div className="adminShowCard" key={show.id}>
            <img className="adminCardImage" height={200} width={100} onClick={() => {
                navigation.navigate(`/city/${show.name.toLowerCase()}/${show.id}`);
            }} src={show.iconSrc} alt={show.name} />
            <h4><b>{show.name}</b></h4><br />
            <p>{show.description}</p>
            <div className="adminCardButtonContainer">
                <Button className="adminCardButton" onClick={async () => {
                    navigation.navigate(`/admin/edit-show/${theaterName}/${show.id}`)
                }}>Edit</Button>
                <Button className="adminCardButton" onClick={async () => {
                    await deleteShow(show.id);
                    const newShows: Array<Show> = removeArrayItem(shows, show);
                    setShows(newShows);
                    toastSuccess('Successfully deleted show!');
                }}>Delete</Button>
                <Button className="adminCardButton" onClick={async () => {
                    navigation.navigate(`/admin/performances/${show.id}`)
                }}>Manage</Button>
            </div>
        </div>
    })


    return (
        <div>
            <AdminMainMenuComponent />
            <div className="container">
                <Button className="defaultButton" onClick={() => {
                    navigation.navigate(`/add-show/${theaterName}/${theaterId}`)
                }}>Add new show</Button>
                <div className="container-horizontal">
                    {showItems}
                </div>
            </div>
        </div>
    );
}