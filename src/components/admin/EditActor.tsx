import { ImagePicker } from 'react-file-picker';
import React, { useState, useEffect } from 'react'
import { toastSuccess, toastError } from '../../components/ToastComponent';
import { useNavigation } from 'react-navi';
import { getActor, updateActor } from '../../network/requests';
import { CircularProgress } from '@material-ui/core';
import { AdminMainMenuComponent } from '../../components/menu/AdminMainMenu';

interface EditActorProps {
    actorId: string;
}

interface Actor {
    id: string;
    name: string;
    iconSrc: string;
}

export function EditActor({ actorId }: EditActorProps) {
    const navigation = useNavigation();
    const [imageUploaded, setImageUploaded] = useState(false);
    const [name, setName] = useState('');
    const [actor, setActor] = useState<Actor>({ iconSrc: '', name: '', id: '' });
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const [encodedImage, setEncodedImage] = useState('');

    useEffect(() => {
        async function fetchActor() {
            const actorResult = await getActor(actorId);
            setActor({
                name: actorResult.name,
                iconSrc: actorResult.image_uri,
                id: actorResult.id
            });
        }
        fetchActor()
    }, [])

    useEffect(() => {
        setName(actor.name);
        setImageUploaded(true);
        document.getElementById("fname")!!.value = actor.name;
    }, [actor, setActor])

    useEffect(() => {
        if (imageUploaded && name !== '' && showErrorMsg) {
            setShowErrorMsg(false);
        }
    }, [name, imageUploaded, setShowErrorMsg, showErrorMsg])

    if (!actor || actor === undefined) {
        return <div className="centerLoader">
            <CircularProgress />
        </div>;
    }

    return (
        <div>
            <AdminMainMenuComponent />
            <div className="container">
                <div className="addCityCard">
                    <label>Actor full name:</label><br />
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
                    {showErrorMsg ?
                        <label className="adminErrorLabel">Please provide name and upload image</label> : null}
                    <br />
                    <br />
                    <br />
                    <button className="addCityButton" onClick={async () => {
                        if (name === '' || !imageUploaded) {
                            setShowErrorMsg(true)
                        } else {
                            await updateActor(actorId, name, encodedImage);
                            toastSuccess(`Updated actor!`)
                            navigation.navigate('/admin/actors')
                        }
                    }}>Save changes</button>
                </div>
            </div>
        </div>
    );
}