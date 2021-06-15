import React, { useState, useEffect } from 'react'
import { ImagePicker } from 'react-file-picker';
import { toastSuccess, toastError } from '../ToastComponent';
import { useNavigation } from 'react-navi';
import { AdminMainMenuComponent } from '../../components/menu/AdminMainMenu';
import { addShow, getActors } from '../../network/requests';
import { Checkbox } from 'semantic-ui-react';
import { removeArrayItem } from '../../util';
import { CircularProgress } from '@material-ui/core';

interface Actor {
    id: string;
    image: string;
    name: string;
}

interface AddShowProps {
    theaterName: string;
    theaterId: string;
}

export function AddShow({ theaterName, theaterId }: AddShowProps) {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [imageUploaded, setImageUploaded] = useState(false);
    const [actors, setActors] = useState<Array<Actor>>();
    const [selectedActors, setSelectedActors] = useState<Array<string>>([]);
    const [description, setDescription] = useState('');
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const [encodedImage, setEncodedImage] = useState('');

    useEffect(() => {
        if (description != '' && selectedActors.length > 0 && name !== '' && showErrorMsg) {
            setShowErrorMsg(false);
        }
    }, [name, setShowErrorMsg, showErrorMsg, description])

    useEffect(() => {
        async function fetchActors() {
            const actorsResult = await getActors();
            const mappedActors: Array<Actor> = actorsResult.map((actor) =>
                ({
                    id: actor.id,
                    name: actor.name,
                    image: actor.image_uri,
                }))
            setActors(mappedActors);
        }
        fetchActors()
    }, [])

    if (!actors || actors === undefined) {
        return <div className="centerLoader">
            <CircularProgress />
        </div>;
    }

    const actorBoxes = actors.map((actor) => {
        return <Checkbox key={actor.id} value={actor.id} label={actor.name} onChange={(event, data) => {
            const currentActors = selectedActors;
            data.checked ? currentActors?.push(actor.id) : removeArrayItem(currentActors, actor.id);
            setSelectedActors(currentActors);
        }} />
    })

    return (
        <div>
            <AdminMainMenuComponent />
            <div className="container">
                <div className="addCityCard">
                    <label>Show name:</label><br />
                    <input type="text" id="fname" name="fname" onChange={(event) => {
                        setName(event.target.value);
                    }}></input><br /><br /><br />
                    <label>Show description:</label><br />
                    <textarea id="fdesc" rows={10} cols={30} name="fdesc" onChange={(event) => {
                        setDescription(event.target.value);
                    }}></textarea><br /><br /><br />
                    <ImagePicker
                        extensions={['jpg', 'jpeg', 'png']}
                        dims={{ minWidth: 10, maxWidth: 2000, minHeight: 10, maxHeight: 2000 }}
                        onChange={(base64: any) => {
                            toastSuccess('Upload successful!')
                            setImageUploaded(true);
                            setShowErrorMsg(false);
                            setEncodedImage(base64)
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
                        <label className="adminErrorLabel">Please provide name</label> : null}
                    <br />
                    <br />
                    <br />
                    {actorBoxes}
                    <br />
                    <br />
                    <br />
                    <button className="addCityButton" onClick={async () => {
                        if (name === '') {
                            setShowErrorMsg(true)
                        } else {
                            await addShow(name, description, encodedImage, theaterId, selectedActors);
                            toastSuccess(`Added new show: ${name}`)
                            navigation.navigate(`/admin/theater/${theaterName}/${theaterId}`)
                        }
                    }}>Add show</button>
                </div>
            </div>
        </div>
    );
}