import React, { useEffect, useState } from 'react';
import { getCities, deleteCity } from '../../network/requests';
import { useNavigation } from 'react-navi';
import { Button, CircularProgress } from '@material-ui/core';
import { toastSuccess } from '../../components/ToastComponent';
import { AdminMainMenuComponent } from '../../components/menu/AdminMainMenu';
import { removeArrayItem } from '../../util';

interface City {
    id: string;
    name: string;
    iconSrc: string;
}

export function ManageCities() {
    const [cities, setCities] = useState<Array<City>>();
    const navigation = useNavigation();
    useEffect(() => {
        async function fetchCities() {
            const citiesResult = await getCities();
            console.log('cities: ', citiesResult);
            const mappedCities: Array<City> = citiesResult.map((city) =>
                ({
                    id: city.id,
                    name: city.name,
                    iconSrc: city.image_uri,
                }))
            setCities(mappedCities);
        }
        fetchCities()
    }, [cities, setCities])

    if (!cities || cities === undefined) {
        return <div className="centerLoader">
            <CircularProgress />
        </div>;
    }

    const cityItems = cities.map((city) => {
        return <div className="adminCard" key={city.id}>
            <img className="adminCardImage" height={200} width={100} src={city.iconSrc} alt={city.name} />
            <h4><b>{city.name}</b></h4>
            <div className="container-horizontal">
                <Button className="adminCardButton" onClick={async () => {
                    navigation.navigate(`/admin/edit-city/${city.id}`)
                }}>Edit</Button>
                <Button className="adminCardButton" onClick={async () => {
                    await deleteCity(city.id);
                    const newCities: Array<City> = removeArrayItem(cities, city);
                    setCities(newCities);
                    toastSuccess('Successfully deleted city!');
                }}>Delete</Button>
            </div>
        </div>
    })


    return (
        <div>
            <AdminMainMenuComponent />
            <div className="container">
                <Button className="defaultButton" onClick={() => {
                    navigation.navigate('/add-city')
                }}>Add new city</Button>
                <div className="container-horizontal">
                    {cityItems}
                </div>
            </div>
        </div>
    );
}