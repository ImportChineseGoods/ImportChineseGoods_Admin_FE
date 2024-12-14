import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Consignments from './screens/Consignments'
import ConsignmentDetail from './screens/ConsignmentDetail'

function ConsignmentPage() {
  return (
    <Routes>
            <Route path="/" element={<Consignments />} />
            <Route path="/:consignment_id" element={<ConsignmentDetail />} />
        </Routes>
  )
}

export default ConsignmentPage