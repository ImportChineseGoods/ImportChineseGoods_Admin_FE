import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AddBOL from './screens/AddBOL'
import ManageBOL from './screens/ManageBOL'

const WarehouseVNPage = () => {
  return (
    <Routes>
        <Route path="/add" element={<AddBOL />} />
        <Route path="/manageBol" element={<ManageBOL />} />
    </Routes>
  )
}

export default WarehouseVNPage