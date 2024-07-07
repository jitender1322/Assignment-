import React, { useState } from 'react'
import { auth, storage, db } from '../../firebaseConfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';

export default function Post() {
    const [title, setTitle] = useState('');
    const [des, setDes] = useState('');
    const [img, setImg] = useState();

    const upload = async () => {
        const user = auth.currentUser;
        console.log(user);
        const storageRef = ref(storage, `Post/${user.uid}/${Date.now()}`);
        await uploadBytes(storageRef, img);
        const downloadUrl = await getDownloadURL(storageRef);

        await setDoc(doc(db, 'Post', `${Date.now()}`), {
            'title': title,
            'description': des,
            'image': downloadUrl,
            'name': user.uid,
            'timestamp': Date.now()
        })
    }
    return (
        <div>
            <h1>Post</h1>
            <input type="text" placeholder='title' onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder='description' onChange={(e) => setDes(e.target.value)} />
            <input type="file" onChange={(e) => setImg(e.target.files[0])} />

            <button onClick={upload} >Upload</button>
        </div>
    )
}
