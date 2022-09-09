import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from "react";
import Home from "./components/pages/Home";
import Auth from "./components/pages/Auth";
import LogIn from "./components/pages/LogIn";

const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<LogIn />} />
                <Route path='/home' element={<Home />} />
                <Route path='/auth/:access_token/:refresh_token' element={<Auth />} />
            </Routes>
        </BrowserRouter>
    )
}

export default RouteSwitch;
