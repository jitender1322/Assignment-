import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProductDisplay from './01Project/01FakeJsonApi/ProductDisplay'
import ProductDetails from './01Project/01FakeJsonApi/ProductDetails'

export default function Router() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<ProductDisplay />} ></Route>
                    <Route path='/product/:id' element={<ProductDetails />} ></Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}
