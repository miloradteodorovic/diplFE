import { ImagePicker } from 'react-file-picker';
import React, { useState, useEffect } from 'react'
import { toastSuccess, toastError } from '../../components/ToastComponent';
import { useNavigation } from 'react-navi';
import { updateShow, getShow, getActors } from '../../network/requests';
import { CircularProgress } from '@material-ui/core';
import { Checkbox } from 'semantic-ui-react';
import { removeArrayItem } from '../../util';
import { AdminMainMenuComponent } from '../../components/menu/AdminMainMenu';

interface EditShowProps {
    showId: string;
    theaterName: string;
}

interface Actor {
    id: string;
    name: string;
}

interface Show {
    id: string;
    name: string;
    iconSrc: string;
    theaterId: string;
    description: string;
    actors: Array<Actor>;
}

export function EditShow({ theaterName, showId }: EditShowProps) {
    const navigation = useNavigation();
    const [imageUploaded, setImageUploaded] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [actorList, setActorList] = useState<Array<Actor>>([]);
    const [selectedActors, setSelectedActors] = useState<Array<string>>([]);
    const [theaterId, setTheaterId] = useState('');
    const [show, setShow] = useState<Show>({ id: '', name: '', iconSrc: '', description: '', theaterId: '', actors: [] });
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const [encodedImage, setEncodedImage] = useState('');

    useEffect(() => {
        async function fetchCity() {
            const showResult = await getShow(showId);
            setShow({
                name: showResult.name,
                iconSrc: showResult.image_uri,
                id: showResult.id,
                theaterId: showResult.theater,
                actors: showResult.actors,
                description: showResult.description
            });
        }
        fetchCity()
    }, [])

    useEffect(() => {
        async function fetchActors() {
            const actorResult = await getActors();
            setActorList(actorResult.map((actor) => ({
                id: actor.id,
                name: actor.name
            })))
        }
        fetchActors()
    }, [])

    useEffect(() => {
        setName(show.name);
        setImageUploaded(true);
        setTheaterId(show.theaterId)
        setDescription(show.description)
        setSelectedActors(show.actors.map((actor) => (actor.id)))
        document.getElementById("fname")!!.value = show.name;
        document.getElementById("fdesc")!!.value = show.description;
    }, [show, setShow])

    useEffect(() => {
        if (imageUploaded && name !== '' && showErrorMsg) {
            setShowErrorMsg(false);
        }
    }, [name, imageUploaded, setShowErrorMsg, showErrorMsg])

    if (!show || show === undefined) {
        return <div className="centerLoader">
            <CircularProgress />
        </div>;
    }

    const actorBoxes = actorList.map((actor) => {
        return <Checkbox key={actor.id} checked={selectedActors.includes(actor.id)} value={actor.id} label={actor.name} onChange={(event, data) => {
            const currentActors = selectedActors;
            data.checked ? currentActors?.push(actor.id) : removeArrayItem(currentActors, actor.id);
            setSelectedActors([...currentActors]);
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
                    <textarea id="fdesc" rows={10} cols={30} name="fdesc" onChange={(event) => {
                        setDesription(event.target.value);
                    }}></textarea><br /><br /><br />
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
                    {actorBoxes}<br />
                    {showErrorMsg ?
                        <label className="adminErrorLabel">Please provide name and upload image</label> : null}
                    <br />
                    <br />
                    <br />
                    <button className="addCityButton" onClick={async () => {
                        if (name === '' || !imageUploaded) {
                            setShowErrorMsg(true)
                        } else {
                            await updateShow(show.id, description, name, encodedImage, theaterId, selectedActors);
                            toastSuccess(`Updated show!`)
                            navigation.navigate(`/admin/theater/${theaterName}/${theaterId}`)
                        }
                    }}>Save changes</button>
                </div>
            </div>
        </div>
    );
}