import React, { useEffect, useState } from 'react';

import '../../styles/index_user.css'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import { getCities } from '../../network/requests';
import { GridList, GridListTile, GridListTileBar, CircularProgress } from '@material-ui/core';
import { useNavigation } from 'react-navi';
import { MainMenuComponent } from '../menu/MainMenuComponent';

export interface CityItem {
    id: string;
    name: string;
    iconSrc: string;
}

export function HomeScreen() {
    const [cities, setCities] = useState<Array<CityItem>>();
    const navigation = useNavigation();
    useEffect(() => {
        async function fetchCities() {
            const citiesResult = await getCities();
            console.log('cities: ', citiesResult);
            const mappedCities = citiesResult.map((city) =>
                ({
                    id: city.id,
                    name: city.name,
                    iconSrc: city.image_uri,
                }))
            setCities(mappedCities);
        }
        fetchCities()
    }, [])

    if (!cities || cities === undefined) {
        return <div className="centerLoader">
            <CircularProgress />
        </div>;
    }

    return (
        <div className="page">
            <MainMenuComponent /><br />
            <h1>
                Welcome
            </h1>
            <div className="gridListRoot">
                <GridList spacing={50} cellHeight={250} className="gridList">
                    {cities.map((city) => (
                        <GridListTile className="gridListItem" key={city.id}>
                            <img onClick={() => {
                                navigation.navigate(`/city/${city.name.toLowerCase()}/${city.id}`);
                            }} src={city.iconSrc} alt={city.name} />
                            <GridListTileBar title={city.name} />
                        </GridListTile>
                    ))}
                </GridList>
            </div>
        </div>
    );
}
