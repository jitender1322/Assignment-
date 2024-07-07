import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

export default function Guest() {
    const navigate = useNavigate();
    const [alluser, setAlluser] = useState([]);
    useEffect(() => {
        fetchAlluser();
    }, []);
    const fetchAlluser = async () => {
        const querSanpshot = await getDocs(collection(db, 'Student'))
        const user = [];
        querSanpshot.forEach((doc) => {
            user.push({ uid: doc.id, ...doc.data() })
        });
        setAlluser(user);
    };

    const deleteUser = async (userid) => {
        await deleteDoc(doc(db, 'Student', userid));
        const newArray = alluser.filter(user => user.uid !== userid);
        setAlluser(newArray);
    }
    return (
        <div>
            <h1>Guest</h1>
            <table border={1}>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Picture</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th colSpan={2} >Action</th>
                    </tr>
                </thead>
                <tbody>
                    {alluser ?
                        alluser.map((e, i) => {
                            return <tr key={i}>
                                <td> {i + 1} </td>
                                <td> {alluser.profilePic ? <img src={alluser.profilePic} alt="" width='50' height='50' /> : <img src="https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg" width='50' height='50' alt="" />} </td>
                                <td> {e.name} </td>
                                <td> {e.email} </td>
                                <td> <button onClick={() => navigate(`/edit/${e.uid}`)}>Edit</button></td>
                                <td> <button onClick={() => deleteUser(e.uid)}>Delete</button></td>
                            </tr>
                        }) : loading}
                </tbody>
            </table>
        </div>
    )
}
