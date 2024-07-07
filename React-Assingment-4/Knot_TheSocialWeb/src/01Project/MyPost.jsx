import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebaseConfig';
import { arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import Loader from './Loader';
import { Avatar, IconButton, Typography, Card, CardHeader, CardMedia, CardContent, CardActions, Menu, MenuItem, Button, Box, TextField } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function MyPost() {
    useEffect(() => {
        fetchPost();
        fetchUser();
    }, []);

    const [myPost, setMyPost] = useState([]);
    const [postUser, setPostUser] = useState({});
    const [postUserPic, setPostUserPic] = useState({});
    const [anchorElUser, setAnchorElUser] = useState({});
    const [postIndex, setPostIndex] = useState(null);
    const [comment, setComment] = useState('');
    const [viewIndex, setViewIndex] = useState(null);

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

    const fetchPost = async () => {
        const user = auth.currentUser;
        const querSanpshot = await getDocs(collection(firestore, 'Post'));
        const posts = [];
        querSanpshot.forEach((doc) => {
            let record = doc.data();
            if (record.uid === user.uid) {
                posts.push({
                    'title': record.title,
                    'description': record.description,
                    'image': record.image,
                    'id': doc.id,
                    'uid': record.uid,
                    'time': record.time,
                    'likes': record.likes,
                    'comments': record.comments
                });
            }
        });
        posts.reverse();
        setMyPost(posts);
    };

    const fetchUser = async () => {
        const querSanpshot = await getDocs(collection(firestore, "User"));
        const user = {};
        const pPic = {};
        querSanpshot.forEach((doc) => {
            const record = doc.data();
            user[doc.id] = record.fname + " " + record.lname;
            pPic[doc.id] = record.picture;
        });
        setPostUser(user);
        setPostUserPic(pPic);
    };

    const handleOpenUserMenu = (event, id) => {
        setAnchorElUser((prev) => ({ ...prev, [id]: event.currentTarget }));
    };

    const handleCloseUserMenu = (id) => {
        setAnchorElUser((prev) => ({ ...prev, [id]: null }));
    };

    const handleDelete = async (id) => {
        await deleteDoc(doc(firestore, 'Post', id));
        setMyPost(myPost.filter(item => item.id !== id));
    };

    const handleEdit = async (id) => {
        console.log(id);
    };

    const handleLike = async (postId) => {
        const specificPost = await getDoc(doc(firestore, 'Post', postId));
        const postData = await specificPost.data().likes || [];
        const user = auth.currentUser;
        if (postData.includes(user.uid)) {
            const oldPost = await getDoc(doc(firestore, 'Post', postId));
            const oldData = oldPost.data().likes;
            const newData = oldData.filter(item => item !== user.uid);
            await updateDoc(doc(firestore, 'Post', postId), {
                'likes': newData
            });
            const updatePost = myPost.map((post) => post.id === postId ? { ...post, 'likes': newData } : post)
            setMyPost(updatePost);
        } else {
            await updateDoc(doc(firestore, 'Post', postId), {
                'likes': [...postData, user.uid]
            })
            console.log('you just liked the post');
            const updatePost = myPost.map((post) => post.id === postId ? { ...post, 'likes': [...post.likes, user.uid] } : post)
            setMyPost(updatePost);
        }
    }

    const handelComment = async (postId) => {
        const user = auth.currentUser;
        if (comment == '') { alert('please write comment') }
        else {
            const commentObj = {
                text: comment,
                userId: user.uid,
                timestamp: Date.now()
            }
            await updateDoc(doc(firestore, 'Post', postId), {
                comments: arrayUnion(commentObj)
            });

            const updateDom = myPost.map((post) => postId === post.id ? { ...post, 'comments': [...post.comments, commentObj] } : post)
            setMyPost(updateDom);

            setComment('')
            setPostIndex(null)
        }
    }
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
            {myPost.length > 0 ?
                myPost.map((e, i) => (
                    <div style={{ alignItems: 'center', gap: '20px', marginTop: '20px', width: '400px', position: 'relative' }} key={i}>
                        <Card sx={{ width: '100%', borderRadius: '12px', boxShadow: ' rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset', position: 'relative', transition: '.3s ease' }}>
                            <CardHeader
                                avatar={
                                    <Avatar aria-label="recipe" src={postUserPic?.[e.uid]} ></Avatar>
                                }
                                action={
                                    <Box>
                                        <IconButton aria-label="settings" onClick={(event) => handleOpenUserMenu(event, e.id)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            sx={{ mt: '45px' }}
                                            anchorEl={anchorElUser[e.id] || null}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            open={Boolean(anchorElUser[e.id])}
                                            onClose={() => handleCloseUserMenu(e.id)}
                                        >
                                            <MenuItem onClick={() => handleCloseUserMenu(e.id)} sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Button onClick={() => handleEdit(e.id)}>Edit</Button>
                                                <Button onClick={() => handleDelete(e.id)}>Delete</Button>
                                            </MenuItem>
                                        </Menu>
                                    </Box>
                                }
                                title={postUser?.[e.uid]}
                                subheader={e.title}
                            />
                            <CardMedia
                                component="img"
                                height="194"
                                image={e.image}
                                alt="image"
                            />
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    {e.description}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ margin: '10px 0' }}>
                                <IconButton aria-label="add to favorites" onClick={() => handleLike(e.id)} >
                                    <FavoriteIcon sx={{ color: e?.likes?.includes(e.uid) ? 'red' : '' }} />
                                </IconButton>
                                <IconButton aria-label="share" onClick={() => setPostIndex(i)} >
                                    <CommentIcon />
                                </IconButton>
                            </CardActions>
                            <span style={{ position: 'absolute', left: '64px', bottom: '12px', color: 'grey', fontSize: '12px' }}>{e.comments.length} comments</span>
                            <span style={{ position: 'absolute', left: '24px', bottom: '12px', color: 'grey', fontSize: '12px' }}>{e?.likes?.length} like</span>
                            <span style={{ position: 'absolute', right: '8px', bottom: '12px', color: 'grey', fontSize: '12px' }} >{timeAgo(e.time)}</span>
                        </Card>
                        <div style={{ width: '100%', position: 'absolute', bottom: '0', zIndex: '-1' }} className={postIndex === i ? 'popDown' : ''} >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                                <TextField value={comment} placeholder='write comment...' sx={{ width: '95%', backgroundColor: 'transparent', border: 'none', padding: '0 10px' }} onChange={(e) => setComment(e.target.value)} ></TextField>
                                <IconButton sx={{ position: 'absolute', right: '20px' }} onClick={() => handelComment(e.id)} >
                                    <SendIcon />
                                </IconButton>
                            </Box>
                            <span style={{ color: '#1976d2', fontSize: '14px', marginLeft: '30px', cursor: 'pointer' }} onClick={() => setViewIndex(i)}>view all comments</span>
                        </div>
                        <div style={{ width: '100%', overflow: 'hidden', display: 'none' }} className={viewIndex === i ? 'viewDown' : ''} >
                            <Box sx={{ position: 'absolute', bottom: '-115px', width: '100%', zIndex: '33', backgroundColor: 'white', boxShadow: ' rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset', borderRadius: '0 0 12px 12px' }}>
                                <IconButton size='small' onClick={() => { setViewIndex(null); setPostIndex(null) }}>
                                    <CloseIcon sx={{ textAlign: 'right' }} />
                                </IconButton>
                                {e.comments.map((e, i) => {
                                    return <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', width: '100%', boxShadow: ' rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset', borderRadius: '12px', margin: '10px 0', backgroundColor: 'white' }} >
                                        <Avatar src={postUserPic?.[e.userId]}></Avatar>
                                        <Box>
                                            <Typography variant='body2'>{postUser?.[e.userId]}</Typography>
                                            <Typography variant='body1'>{e.text}</Typography>
                                        </Box>
                                        <Typography sx={{ color: 'grey', fontSize: '12px' }}>{timeAgo(e.timestamp)}</Typography>
                                    </Box>
                                })}
                            </Box>
                        </div>
                    </div>
                )) : <Loader />}
        </div>
    );
}
