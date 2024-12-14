import { createContext, useState, useEffect } from 'react';
import { notification } from 'antd';
import { parametersApi } from '@api/parameterApi';

// Khởi tạo AuthContext
export const AuthContext = createContext({
  isAuthenticated: false,
  user: {
    email: '',
    name: '',
    id: '',
    avatar: ''
  },
  appLoading: true,
  applicableRate: 'Đang tải...',
  setAuth: () => {},
  setAppLoading: () => {}
});

export const AuthWrapper = (props) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: {
      email: '',
      name: '',
      id: '',
      avatar: ''
    }
  });
  const [appLoading, setAppLoading] = useState(true);
  const [applicableRate, setApplicableRate] = useState('Đang tải...');

  useEffect(() => {
    if (1) {
      parametersApi.getByType('applicable_rate')
        .then((res) => {
          if (res.status === 200) {
            setApplicableRate(res.parameter.value);
          } else {
            notification.error({
              message: 'Lấy thông tin tỷ giá thất bại',
              description: res?.RM ?? 'error',
            });
          }
        })
        .catch((err) => {
          console.error(err);
          notification.error({
            message: 'Lấy thông tin tỷ giá thất bại',
            description: err?.RM ?? 'error',
          });
        });
    }
    setAppLoading(false); 
  }, []);

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
      applicableRate
    }}>
      {props.children}
    </AuthContext.Provider>
  );
};
