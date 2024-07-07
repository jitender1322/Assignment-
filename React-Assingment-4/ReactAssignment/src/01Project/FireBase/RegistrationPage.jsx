import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { auth, db } from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'

export default function RegistrationPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredentials.user;
        if (user) {
            await setDoc(doc(db, "Student", user.uid), {
                name: name,
                email: email
            })
        }
    }
    return (
        <div>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input type="text" placeholder='Enter Name' onChange={(e) => setName(e.target.value)} />
                <input type="email" placeholder='Enter Email' onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder='Enter Password' onChange={(e) => setPassword(e.target.value)} />
                <button>Submit</button>
            </form>
            <button onClick={() => navigate('login', { replace: true })} >login?</button>
            <button onClick={() => navigate('guest', { replace: true })} >Guest?</button>
        </div>
    )
}
