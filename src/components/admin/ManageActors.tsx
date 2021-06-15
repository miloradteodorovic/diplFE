import React, { useEffect, useState } from 'react';
import { getActors, deletePerformance, deleteActor } from '../../network/requests';
import { useNavigation } from 'react-navi';
import { Button, CircularProgress } from '@material-ui/core';
import { toastSuccess } from '../../components/ToastComponent';
import { AdminMainMenuComponent } from '../../components/menu/AdminMainMenu';
import { removeArrayItem } from '../../util';

interface Actor {
    id: string;
    name: string;
    iconSrc: string;
}

export function ManageActors() {
    const [actors, setActors] = useState<Array<Actor>>();
    const navigation = useNavigation();
    useEffect(() => {
        async function fetchActors() {
            const actorsResult = await getActors();
            const mappedActors: Array<Actor> = actorsResult.map((city) =>
                ({
                    id: city.id,
                    name: city.name,
                    iconSrc: city.image_uri,
                }))
            setActors(mappedActors);
        }
        fetchActors()
    }, [actors, setActors])

    if (!actors || actors === undefined) {
        return <div className="centerLoader">
            <CircularProgress />
        </div>;
    }

    const actorItems = actors.map((actor) => {
        return <div className="adminActorCard" key={actor.id}>
            <img className="adminCardImage" height={200} width={100} src={actor.iconSrc} alt={actor.name} />
            <h4><b>{actor.name}</b></h4>
            <div className="container-horizontal">
                <Button className="adminCardButton" onClick={async () => {
                    navigation.navigate(`/admin/edit-actor/${actor.id}`)
                }}>Edit</Button>
                <Button className="adminCardButton" onClick={async () => {
                    await deleteActor(actor.id);
                    const newArr: Array<Actor> = removeArrayItem(actors, actor);
                    setActors(newArr);
                    toastSuccess('Successfully deleted actor!');
                }}>Delete</Button>
            </div>
        </div>
    })


    return (
        <div>
            <AdminMainMenuComponent />
            <div className="container">
                <Button className="defaultButton" onClick={() => {
                    navigation.navigate('/add-actor')
                }}>Add new actor</Button>
                <div className="container-horizontal">
                    {actorItems}
                </div>
            </div>
        </div>
    );
}