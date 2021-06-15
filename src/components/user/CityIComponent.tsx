import React, { useEffect, useState } from 'react';
import { getTheatersForCity } from '../../network/requests';
import { GridList, GridListTile, GridListTileBar, CircularProgress } from '@material-ui/core';
import { useNavigation } from 'react-navi';
import { MainMenuComponent } from '../menu/MainMenuComponent';

export interface TheaterItem {
    id: string;
    name: string;
    iconSrc: string;
}

export interface CityComponentProps {
    id: string;
    name: string;
}

export function CityComponent({ id, name }: CityComponentProps) {
    const [theaters, setTheaters] = useState<Array<TheaterItem>>();
    const navigation = useNavigation();
    useEffect(() => {
        async function fetchTheaters() {
            const theatersResult = await getTheatersForCity(id);
            const mappedTheaters = theatersResult.map((theater) =>
                ({
                    id: theater.id,
                    name: theater.name,
                    iconSrc: theater.image_uri,
                }))
            setTheaters(mappedTheaters);
        }
        fetchTheaters()
    }, [])

    if (!theaters || theaters === undefined) {
        return <div className="centerLoader">
            <CircularProgress />
        </div>;
    }

    return (
        <div>
            <MainMenuComponent /><br />
            <h1>
                {name.toUpperCase()}
            </h1>
            <div className="gridListRoot">
                <GridList spacing={50} cellHeight={300} className="gridList">
                    {theaters.map((theater) => (
                        <GridListTile className="gridListItem" key={theater.id}>
                            <img onClick={() => {
                                navigation.navigate(`/theater/${theater.name.toLowerCase()}/${theater.id}`);
                            }} src={theater.iconSrc} alt={theater.name} />
                            <GridListTileBar
                                title={theater.name}
                            />
                        </GridListTile>
                    ))}
                </GridList>
            </div>
        </div>
    );
}