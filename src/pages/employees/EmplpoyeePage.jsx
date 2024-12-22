import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Employees from './screens/Employees'
import UpdatEmployee from './screens/UpdateEmployee'

function EmplpoyeePage() {
  return (
    <Routes>
      <Route path="/" element={<Employees />} />
      <Route path="/update/:employee_id/*" element={<UpdatEmployee/>} />
    </Routes>
  )
}

export default EmplpoyeePage
