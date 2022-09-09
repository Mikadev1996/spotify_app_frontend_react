import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from "react";
import Home from "./components/Home";
import Auth from "./components/Auth";

const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/auth/:access_token/:refresh_token' element={<Auth />} />
            </Routes>
        </BrowserRouter>
    )
}

export default RouteSwitch;
