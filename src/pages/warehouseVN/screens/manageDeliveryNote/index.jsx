import React from 'react'
import { Route, Routes } from 'react-router-dom'
import CreateDeliveryNote from './CreateDeliveryNote'
import Deliveries from './Deliveries'
import DeliveryDetail from './DeliveryDetail'


const DeliveryPage = () => {
    return (
        <Routes>
            <Route path="/" element={<Deliveries />} />
            <Route path="/create" element={<CreateDeliveryNote />} />
            <Route path="/:delivery_id/*" element={<DeliveryDetail />} />
        </Routes>
    )
}

export default DeliveryPage