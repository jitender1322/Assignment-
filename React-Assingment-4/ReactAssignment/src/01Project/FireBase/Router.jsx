import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RegistrationPage from './RegistrationPage'
import Login from './Login'
import Deshboard from './Deshboard'
import Guest from './Guest'
import EditUser from './EditUser'
import Post from './Post'
import AllPost from './AllPost'
import AllUser from './AllUser'
import ChatScreen from './ChatScreen'
export default function Router() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<RegistrationPage />} ></Route>
                    <Route path='/login' element={<Login />} ></Route>
                    <Route path='/dashboard' element={<Deshboard />} ></Route>
                    <Route path='/guest' element={<Guest />} ></Route>
                    <Route path='/edit/:uid' element={<EditUser />} ></Route>
                    <Route path='/post' element={<Post />} ></Route>
                    <Route path='/allpost' element={<AllPost />} ></Route>
                    <Route path='/alluser' element={<AllUser />} ></Route>
                    <Route path='/chatscreen/:uid' element={<ChatScreen />} ></Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}
