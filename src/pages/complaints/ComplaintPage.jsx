import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Complaints from './screens/Complaints';


const ComplaintsPage = () => {
    return (
        <Routes>
            <Route path="/" element={<Complaints />} />
        </Routes>
    )
}

export default ComplaintsPage;