import { ImagePicker } from 'react-file-picker';
import React, { useState, useEffect } from 'react'
import { toastSuccess, toastError } from '../../components/ToastComponent';
import { useNavigation } from 'react-navi';
import { addActor } from '../../network/requests';
import { AdminMainMenuComponent } from '../../components/menu/AdminMainMenu';

export function AddActor() {
    const [imageUploaded, setImageUploaded] = useState(false);
    const [name, setName] = useState('');
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const [encodedImage, setEncodedImage] = useState('');

    useEffect(() => {
        if (imageUploaded && name !== '' && showErrorMsg) {
            setShowErrorMsg(false);
        }
    }, [name, imageUploaded, setShowErrorMsg, showErrorMsg])

    const navigation = useNavigation();

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
                            await addActor(name, encodedImage);
                            toastSuccess(`Added new actor: ${name}`)
                            navigation.navigate('admin/actors')
                        }
                    }}>Add actor</button>
                </div>
            </div>
        </div>
    );
}