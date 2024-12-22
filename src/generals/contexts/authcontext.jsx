import { createContext, useState, useEffect } from 'react';

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

  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const user = JSON.parse(localStorage.getItem('user'));
      const decoded = decodeToken(token);
      
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setAuth({
          isAuthenticated: true,
          user: user,
        });
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
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
