import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Orders from './screens/Orders';
import OrderDetail from './screens/OrderDetail';


const OrdersPage = () => {
    return (
        <Routes>
            <Route path="/" element={<Orders />} />
            <Route path="/:order_id/*" element={<OrderDetail />} />
        </Routes>
    )
}


export default OrdersPage;