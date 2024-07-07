import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

export default function AllUser() {
    const [currentUserRecord, setCurrentUserRecord] = useState();
    const [users, setUsers] = useState();
    const [currentId, setCurrentId] = useState();
    const navigate = useNavigate()
    useEffect(() => {
        const subscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchCurrentUserDetails(user)
            }
            if (currentId) {
                fetchAlluser()
            }
        })
    })
    const fetchCurrentUserDetails = async (user) => {
        if (user) {
            const userData = await getDoc(doc(db, 'Student', user.uid));
            setCurrentUserRecord(userData.data());
            setCurrentId(userData.id)
        }
    }
    const fetchAlluser = async () => {
        const querSanpshot = await getDocs(collection(db, 'Student'))
        const allUserData = [];
        querSanpshot.forEach((doc) => {
            if (doc.id !== currentId) {
                allUserData.push({ uid: doc.id, ...doc.data() })
            }
        });
        setUsers(allUserData);
    };
    return (
        <div>
            {currentUserRecord ? <p>{currentUserRecord.name}</p> : <h1>loading</h1>}
            <table border={1}>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Picture</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users ?
                        users.map((e, i) => {
                            return <tr key={i}>
                                <td> {i + 1} </td>
                                <td> {users.profilePic ? <img src={users.profilePic} alt="" width='50' height='50' /> : <img src="https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg" width='50' height='50' alt="" />} </td>
                                <td> {e.name} </td>
                                <td> {e.email} </td>
                                <td> <button onClick={() => navigate(`/chatscreen/${e.uid}`)}>Message</button></td>
                            </tr>
                        }) : <p>loading</p>}
                </tbody>
            </table>
        </div>
    )
}
