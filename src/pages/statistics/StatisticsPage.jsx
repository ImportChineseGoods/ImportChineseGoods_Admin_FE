import React from 'react'
import { Route, Routes } from 'react-router-dom'
import RevenueStatistics from './screens/RevenueStatistics'
import DebtStatistics from './screens/DebtStatistics'
import ProfitStatistics from './screens/ProfitStatistics'

function StatisticsPage() {
  return (
    <Routes>
      <Route path="/revenue" element={<RevenueStatistics />} />
      <Route path="/debt" element={<DebtStatistics />} />
    <Route path="/profit" element={<ProfitStatistics />} />
    </Routes>
  )
}

export default StatisticsPage