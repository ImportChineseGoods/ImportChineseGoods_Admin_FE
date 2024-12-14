import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Complaints from './screens/Complaints';
import CreateComplaint from './screens/CreateComplaint';


const ComplaintsPage = () => {
    return (
        <Routes>
            <Route path="/" element={<Complaints />} />
            <Route path="/new" element={<CreateComplaint />} />
        </Routes>
    )
}

export default ComplaintsPage;