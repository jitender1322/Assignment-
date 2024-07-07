import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { auth, db } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export default function ChatScreen() {
    const { uid } = useParams();

    const [messageInput, setMessage] = useState('');
    const [selectedUserName, setSelectedUserName] = useState('');
    const [currentUserName, setCurrentUserName] = useState('');

    const [messagesAll, setMessagesAll] = useState([]);
    const [currentuid, setCurrentUid] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUid(user.uid);
            } else {
                setCurrentUid(null); // Handle if user is logged out
            }
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (currentuid && uid) {
            fetchUserNames();
            fetchMessages();
        }
    }, [currentuid, uid]);

    const sendMessage = async () => {
        if (!messageInput.trim()) return; // Prevent sending empty messages

        const newMessage = {
            senderId: auth.currentUser.uid,
            receiverId: uid,
            content: messageInput.trim(),
            timestamp: serverTimestamp(),
        };

        await addDoc(collection(db, 'Chats'), newMessage);
        setMessage('');
        fetchMessages();
    }

    const fetchUserNames = async () => {
        // Fetch selected user's name
        const selectedUserDoc = await getDoc(doc(db, 'Student', uid));
        if (selectedUserDoc.exists()) {
            setSelectedUserName(selectedUserDoc.data().name);
        }

        // Fetch current user's name (logged-in user)
        const currentUserDoc = await getDoc(doc(db, 'Student', auth.currentUser.uid));
        if (currentUserDoc.exists()) {
            setCurrentUserName(currentUserDoc.data().name);
            setCurrentUid(auth.currentUser.uid);
        }
    };

    const fetchMessages = async () => {
        // fetch message between current user and selected user 
        if (!currentuid || !uid) return; // Ensure currentuid and uid are defined

        const q = query(
            collection(db, 'Chats'),
            where('senderId', 'in', [currentuid, uid]),
            where('receiverId', 'in', [currentuid, uid]),
            orderBy('timestamp', 'asc')
        );
        const querySnapshot = await getDocs(q);
        const fetchMessages = [];

        querySnapshot.forEach((doc) => {
            fetchMessages.push(doc.data());
        });

        setMessagesAll(fetchMessages);
    }

    return (
        <div style={{ width: "50%" }}>
            <h1>Welcome to chat screen</h1>
            <p>Chatting with: {selectedUserName}</p>
            <p>Logged in as: {currentUserName}</p>

            <hr />

            <div style={{ width: '300px', height: '300px', overflowY: "scroll" }}>
                {messagesAll.map((message, index) => (
                    <div key={index}
                        style={{ textAlign: message.senderId === auth.currentUser.uid ? "right" : "left", margin: "15px 0" }}>
                        <span style={{ padding: "5px 10px", borderRadius: "10px", backgroundColor: message.senderId === auth.currentUser.uid ? "blue" : "purple", color: "white" }}>
                            {message.content}
                        </span>
                    </div>
                ))}
            </div>

            <hr />

            <h3>Chat with User {selectedUserName}</h3>
            {/* Render messages and message input UI */}
            <input
                type="text"
                value={messageInput}
                placeholder='type your message here'
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}
