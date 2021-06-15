import React, { useEffect, useState } from 'react';
import { getShowsForTheater } from '../../network/requests';
import { GridList, GridListTile, GridListTileBar, CircularProgress } from '@material-ui/core';
import { useNavigation } from 'react-navi';
import { MainMenuComponent } from '../menu/MainMenuComponent';

export interface ShowItem {
    id: string;
    name: string;
    iconSrc: string;
}

export interface TheaterComponentProps {
    id: string;
    name: string;
}

export function TheaterComponent({ id, name }: TheaterComponentProps) {
    const [shows, setShows] = useState<Array<ShowItem>>();
    const navigation = useNavigation();
    useEffect(() => {
        async function fetchTheaters() {
            const showsResult = await getShowsForTheater(id);
            console.log('shows: ', showsResult);
            const mappedShows: Array<ShowItem> = showsResult.map((show) =>
                ({
                    id: show.id,
                    name: show.name,
                    iconSrc: show.image_uri,
                }))
            setShows(mappedShows);
        }
        fetchTheaters()
    }, [])

    if (!shows || shows === undefined) {
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
                    {shows.map((show) => (
                        <GridListTile className="gridListItem" key={show.id}>
                            <img onClick={() => {
                                navigation.navigate(`/show/${show.name.toLowerCase()}/${show.id}`);
                            }} src={show.iconSrc} alt={show.name} />
                            <GridListTileBar title={show.name} />
                        </GridListTile>
                    ))}
                </GridList>
            </div>
        </div>
    );
}