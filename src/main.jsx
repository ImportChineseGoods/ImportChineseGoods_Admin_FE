import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import '@assets/styles/index.css';
import { AuthWrapper } from '@generals/contexts/authcontext.jsx';
import router from './routes';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />  
    </AuthWrapper>
  </React.StrictMode>,
)
