import React, { useState } from 'react'
import { Button } from '@material-ui/core';
import {db, storage} from './firebase';
import firebase from 'firebase';
import './Uploader.css';

function Uploader(props) {

    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState("");

    const handleChange = (e) => {
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const task = storage.ref(`images/${image.name}`).put(image);

        task.on(
            "state_changed",
            (snapshot) => {
                //progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            //Complete function
            () => {
                storage 
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        //post image inside db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imgUrl: url,
                            username: props.username
                        })

                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    })
            }
        )
    }

    return (
        <div className="imgUpload" >
        <progress className="imgUpload_progress" value={progress} max="100" />
           <input
                type="text"
                placeholder="Enter a caption..."
                onChange={(e) => setCaption(e.target.value)}
            />

            <input 
                type="file"
                onChange={handleChange}
            /> 

            <Button onClick={handleUpload} >
                Upload
            </Button>
        </div>
    )
}

export default Uploader;
