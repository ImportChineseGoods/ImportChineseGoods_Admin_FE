import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Customers from './customers/Customers'
import TransactionCustomer from './customers/TransactionCustomer'
import UpdateCustomer from './customers/UpdateCustomer'

function CustomersPage() {
  return (
    <Routes>
      <Route path="/" element={<Customers />} />
      <Route path="/transactions/:customer_id/*" element={<TransactionCustomer />} />
      <Route path="/update/:customer_id/*" element={<UpdateCustomer />} />
    </Routes>
  )
}

export default CustomersPage