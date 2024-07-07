import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredentials.user;
        const userDoc = await getDoc(doc(db, "Student", user.uid));
        if (userDoc) {
            console.log(userDoc.data());
            console.log(userDoc.data().name);
        }
        navigate('/dashboard', { replace: true });
    }
    return (
        <div>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input type="email" placeholder='Enter Email' onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder='Enter Password' onChange={(e) => setPassword(e.target.value)} />
                <button>Submit</button>
            </form>
            <button onClick={() => navigate('/', { replace: true })} >Register?</button>
        </div>
    )
}
