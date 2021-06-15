import { ImagePicker } from 'react-file-picker';
import React, { useState, useEffect } from 'react'
import { toastSuccess, toastError } from '../ToastComponent';
import { useNavigation } from 'react-navi';
import { addTheater, getCities } from '../../network/requests';
import { AdminMainMenuComponent } from '../../components/menu/AdminMainMenu';
import Select from "react-dropdown-select";
import { CircularProgress } from '@material-ui/core';

interface City {
    id: string;
    name: string;
    iconSrc: string;
}

export function AddTheater() {
    const [imageUploaded, setImageUploaded] = useState(false);
    const [name, setName] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const [encodedImage, setEncodedImage] = useState('');
    const [cities, setCities] = useState<Array<City>>();
    const navigation = useNavigation();

    useEffect(() => {
        if (imageUploaded && selectedCity != '' && name !== '' && showErrorMsg) {
            setShowErrorMsg(false);
        }
    }, [name, imageUploaded, setShowErrorMsg, showErrorMsg])

    useEffect(() => {
        async function fetchCities() {
            const citiesResult = await getCities();
            const mappedCities: Array<City> = citiesResult.map((city) =>
                ({
                    id: city.id,
                    name: city.name,
                    iconSrc: city.image_uri,
                }))
            setSelectedCity(mappedCities[0].id);
            setCities(mappedCities);
        }
        fetchCities()
    }, [])

    if (!cities || cities === undefined) {
        return <div className="centerLoader">
            <CircularProgress />
        </div>;
    }

    const options = cities.map((city) => {
        return {
            value: city.id,
            label: city.name,
        }
    })

    return (
        <div>
            <AdminMainMenuComponent />
            <div className="container">
                <div className="addCityCard">
                    <label>Theater name:</label><br />
                    <input type="text" id="fname" name="fname" onChange={(event) => {
                        setName(event.target.value);
                    }}></input><br /><br /><br />
                    <Select options={options} values={options} onChange={(values) => {
                        setSelectedCity(values[0].value)
                    }} />
                    <br /><br /><br />
                    <ImagePicker
                        extensions={['jpg', 'jpeg', 'png']}
                        dims={{ minWidth: 10, maxWidth: 2000, minHeight: 10, maxHeight: 2000 }}
                        onChange={(base64: any) => {
                            toastSuccess('Upload successful!')
                            setImageUploaded(true);
                            setShowErrorMsg(false);
                            setEncodedImage(base64)
                            console.log('uploaded', base64)
                        }}
                        onError={(errMsg: any) => {
                            setImageUploaded(false);
                            toastError('Upload error. Please try again.')
                            setEncodedImage('');
                        }}
                    >
                        <button className="addCityButton" onClick={() => {
                            if (!imageUploaded) {

                            }
                        }}>
                            Click to upload image
                </button>
                    </ImagePicker>
                    {showErrorMsg ?
                        <label className="adminErrorLabel">Please provide name, city and upload image</label> : null}
                    <br />
                    <br />
                    <br />
                    <button className="addCityButton" onClick={async () => {
                        if (name === '' || !imageUploaded) {
                            setShowErrorMsg(true)
                        } else {
                            await addTheater(name, encodedImage, selectedCity);
                            toastSuccess(`Added new theater: ${name}`)
                            navigation.navigate('admin/theaters')
                        }
                    }}>Add theater</button>
                </div>
            </div>
        </div>
    );
}