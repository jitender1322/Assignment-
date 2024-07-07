import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../../firebaseConfig';

export default function EditUser() {
    const { uid } = useParams();
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [uid]);

    const fetchData = async () => {
        const userData = await getDoc(doc(db, "Student", uid));
        setName(userData.data().name);
        setEmail(userData.data().email);
    }
    const update = async (e) => {
        e.preventDefault();
        await updateDoc(doc(db, "Student", uid), {
            'name': name
        })
        navigate('/guest', { replace: true })
    }

    return (
        <div>
            <form onSubmit={(e) => update(e)} >
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" value={email} disabled />
                <button>update</button>
            </form>
        </div>
    )
}
