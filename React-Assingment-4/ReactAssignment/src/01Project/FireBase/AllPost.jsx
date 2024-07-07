import { arrayUnion, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../firebaseConfig';
import { Button } from '@mui/material';
import { update } from 'firebase/database';

export default function AllPost() {
    useEffect(() => {
        fetchAlluser();
        fetchUser();
    }, []);
    const [posts, setPosts] = useState(null);
    const [postUser, setPostUser] = useState(null);
    const [newComment, setNewComment] = useState('');
    const fetchAlluser = async () => {
        const querSanpshot = await getDocs(collection(db, "Post"));
        const fetchPost = [];
        querSanpshot.forEach((doc) => {
            fetchPost.push({ 'id': doc.id, 'likes': doc.likes || [], 'comments': doc.comments || [], ...doc.data() });
            setPosts(fetchPost);
        })
    }
    const fetchUser = async () => {
        const querSanpshot = await getDocs(collection(db, "Student"));
        const user = {}
        querSanpshot.forEach((doc) => {
            const record = doc.data();
            user[doc.id] = record.name;
        })
        setPostUser(user);
    }
    const timeAgo = (timestamp) => {
        const now = Date.now();
        const seconds = Math.floor((now - timestamp) / 1000);

        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
            return ` ${interval} years ago`;
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return `${interval} months ago`;
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return `${interval} days ago`;
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return `${interval} hours ago`;
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return ` ${interval} minutes ago`;
        }
        return `${Math.floor(seconds)} seconds ago`;
    }
    const handleLike = async (postId) => {
        const specificPost = await getDoc(doc(db, 'Post', postId));
        const postDataLikeList = await specificPost.data().likes || [];
        const user = auth.currentUser;
        if (postDataLikeList.includes(user.uid)) return;
        console.log("like added");
        await updateDoc(doc(db, 'Post', postId), {
            'likes': [...postDataLikeList, user.uid]
        })

        const updatePost = posts.map((post) => { post.id === postId ? { ...post, 'likes': [...post.likes, user.uid] } : post });
        setPosts(updatePost);
    }
    const handleComment = async (postId) => {
        const user = auth.currentUser;
        const newCommentObj = {
            text: newComment,
            userid: user.uid,
            timestamp: Date.now()
        }

        await updateDoc(doc(db, 'Post', postId), {
            'comments': arrayUnion(newCommentObj)
        })

        setNewComment('');
        const updateCommentPost = posts.map((post) => post.id === postId ? { ...post, 'comments': [...post.comments, newCommentObj] } : post)
        setPosts(updateCommentPost);
        console.log('---->', posts);
    }
    return (
        <div>
            <h1>AllPost</h1>
            {
                posts ? posts.map((e, i) => {
                    return <div key={i}>
                        <h2>{e.title} {timeAgo?.(e.timestamp)}</h2>
                        <h2>{e.description}</h2>
                        <h2>{postUser?.[e.name]}</h2>
                        <img src={e.image} width='50' height='50' alt="" />
                        <Button onClick={() => handleLike(e.id)} >Like</Button>
                        <br /><br />
                        <h4>Comment Section</h4>
                        <input type="text" placeholder='Enter your comment' onChange={(e) => setNewComment(e.target.value)} />
                        <button onClick={() => handleComment(e.id)} >Add comment</button>
                        {e.comments.map((e, i) => {
                            return <p key={i}>{e.text}</p>
                        })}
                        <br /><br />
                        <hr /> <hr />
                        <br /><br />
                    </div>
                }) : <p>loading</p>
            }
        </div>
    )
}
