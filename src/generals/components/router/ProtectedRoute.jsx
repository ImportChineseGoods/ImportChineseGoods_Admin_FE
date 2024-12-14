import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { notification } from 'antd';
import { AuthContext } from '@generals/contexts/authcontext'; // Import context

const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext); // Lấy auth từ context
  
  useEffect(() => {
    if (!auth.isAuthenticated && localStorage.getItem("access_token") === null) {
      notification.info({
        message: 'Bạn cần đăng nhập để truy cập'
      });
    }
  }, [auth.isAuthenticated]);

  if (!auth.isAuthenticated && localStorage.getItem("access_token") === null) {
    return <Navigate to="/auth/login" />;
  }

  return children;
};

export default ProtectedRoute;
