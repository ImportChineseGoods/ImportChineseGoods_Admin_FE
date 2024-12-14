import React from 'react'
import { Route, Routes } from 'react-router-dom'
import RegisterScreen from './screens/register';
import LoginScreen from './screens/login';


const Auth = () => {

    return (
        <Routes>
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/login" element={<LoginScreen />} />
        </Routes>
    )
}


export default Auth;