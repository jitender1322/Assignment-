import React, { useEffect, useState } from 'react'
import { auth, db, storage } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default function Deshboard() {
    const navigate = useNavigate();
    const [record, setRecord] = useState(null);
    const [profile, setProfie] = useState();
    const [load, setLoad] = useState(false);
    const [path, setPath] = useState();
    useEffect(() => {
        const render = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchData(user)
            }
        })
    }, [])
    const fetchData = async (user) => {
        if (user) {
            const userData = await getDoc(doc(db, "Student", user.uid));
            setRecord(userData.data());
        }
    }
    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login', { replace: true })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (user) {
            const storageRef = ref(storage, `profilePictures/${user.uid}`);
            await uploadBytes(storageRef, profile);
            setLoad(true);
            const downloadUrl = await getDownloadURL(storageRef);
            await updateDoc(doc(db, "Student", user.uid), {
                "profilePic": downloadUrl
            })
            setPath(downloadUrl);
            console.log(downloadUrl);
            setLoad(false);
        }
    }
    return (
        <div>
            <h1>Dashboard</h1>
            {record ? <h2>Welcome {record.name}</h2> : <p>Loading...</p>}

            <button onClick={handleLogout} >Logout</button>

            <form onSubmit={(e) => handleSubmit(e)} >
                <input type="file" onChange={(e) => setProfie(e.target.files[0])} />
                <input type="submit" value='upload' />
            </form>
            {load == true ? <p>Loading</p> : <img src={path} style={{ width: '10%' }} />}

            <button onClick={() => navigate('/post')}>upload post</button>
            <button onClick={() => navigate('/allpost')}>View post</button>
            <button onClick={() => navigate('/alluser')}>All User</button>
        </div>
    )
}
