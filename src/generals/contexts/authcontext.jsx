import { createContext, useState, useEffect } from 'react';
import { notification } from 'antd';
import { parametersApi } from '@api/parameterApi';

// Khởi tạo AuthContext
export const AuthContext = createContext({
  isAuthenticated: false,
  user: {
    username: '',
    name: '',
    id: '',
    avatar: '',
    role: ''
  },
  appLoading: true,
  setAuth: () => {},
  setAppLoading: () => {}
});

export const AuthWrapper = (props) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: {
      username: '',
      name: '',
      id: '',
      avatar: '',
      role: ''
    },
  });
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        setAuth({
          isAuthenticated: true,
          user: user,
        });
      }
    }
    setAppLoading(false); 
  }, []);
  
  return (
    <AuthContext.Provider value={{
      auth,
      setAuth,
      appLoading,
      setAppLoading,
    }}>
      {props.children}
    </AuthContext.Provider>
  );
};
