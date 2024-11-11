import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './styles/index.css'
import RegisterScreen from './screens/customer/register.jsx';
import LoginScreen from './screens/customer/login.jsx';

import CustomerList from './screens/employee/customer/customerList.jsx';
import Homepage from './screens/customer/home.jsx';
import NotFound from './screens/NotFound.jsx';
import { AuthWrapper } from './components/context/authcontext.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Homepage />
      },
      {
        path: 'register',
        element: <RegisterScreen />
      },
      {
        path: 'login',
        element: <LoginScreen />
      },
      {
        path: 'customer-list',
        element: <CustomerList/> 
      }
    ]
  },
  {
    path: '*',
    element: <NotFound/>  // Trang hiển thị khi không tìm thấy đường dẫn
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>,
)
