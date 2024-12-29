import React from 'react'
import { Route, Routes } from 'react-router-dom'

import CreateDeliveryNote from './screens/manageDeliveryNote/CreateDeliveryNote'
import DeliveryPage from './screens/manageDeliveryNote'
import AddBOL from './screens/AddBOL'
import ManageBOL from './screens/ManageBOL'

const WarehouseVNPage = () => {
  return (
    <Routes>
        <Route path="/add" element={<AddBOL />} />
        <Route path="/management-bol" element={<ManageBOL />} />
        <Route path="/delivery-notes/*" element={<DeliveryPage />} />
    </Routes>
  )
}

export default WarehouseVNPage