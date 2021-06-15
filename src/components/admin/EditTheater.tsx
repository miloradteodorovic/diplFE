import { ImagePicker } from 'react-file-picker';
import React, { useState, useEffect } from 'react'
import { toastSuccess, toastError } from '../../components/ToastComponent';
import { useNavigation } from 'react-navi';
import { updateTheater, getTheater, getCities } from '../../network/requests';
import Select from "react-dropdown-select";
import { AdminMainMenuComponent } from '../../components/menu/AdminMainMenu';

interface EditTheaterProps {
    theaterId: string;
}

interface Theater {
    id: string;
    name: string;
    iconSrc: string;
    cityId: string;
}

interface City {
    id: string;
    name: string;
    iconSrc: string;
}

export function EditTheater({ theaterId }: EditTheaterProps) {
    const navigation = useNavigation();
    const [imageUploaded, setImageUploaded] = useState(false);
    const [name, setName] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [cities, setCities] = useState<Array<City>>([]);
    const [theater, setTheater] = useState<Theater>({ id: '', name: '', iconSrc: '', cityId: '' })
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const [encodedImage, setEncodedImage] = useState('');

    useEffect(() => {
        async function fetchCity() {
            const theaterResult = await getTheater(theaterId);
            debugger;
            setTheater({
                name: theaterResult.name,
                iconSrc: theaterResult.image_uri,
                id: theaterResult.id,
                cityId: theaterResult.city
            });
        }
        fetchCity()
    }, [])

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

    useEffect(() => {
        setName(theater.name);
        setImageUploaded(true);
        setSelectedCity(theater.cityId)
        debugger;
        document.getElementById("fname")!!.value = theater.name;
    }, [theater, setTheater])

    useEffect(() => {
        if (imageUploaded && name !== '' && showErrorMsg) {
            setShowErrorMsg(false);
        }
    }, [name, imageUploaded, setShowErrorMsg, showErrorMsg])

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
                    <Select options={options} values={options} onChange={(values) => {
                        setSelectedCity(values[0].value)
                    }} />
                    <br /><br /><br />
                    {showErrorMsg ?
                        <label className="adminErrorLabel">Please provide name and upload image</label> : null}
                    <br />
                    <br />
                    <br />
                    <button className="addCityButton" onClick={async () => {
                        if (name === '' || !imageUploaded) {
                            setShowErrorMsg(true)
                        } else {
                            await updateTheater(theaterId, selectedCity, name, encodedImage);
                            toastSuccess(`Updated theater!`)
                            navigation.navigate('/admin/theaters')
                        }
                    }}>Save changes</button>
                </div>
            </div>
        </div>
    );
}