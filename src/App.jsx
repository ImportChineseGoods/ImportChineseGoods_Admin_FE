
import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import axios from "./util/axios.custiomize"
import { useContext, useEffect } from "react"
import { AuthContext } from "./components/context/authcontext";
import { notification, Spin } from "antd";

function App() {
  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);
  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);
      const res = await axios.get(`/v1/api/account`);
      if (res?.email) {
        setAuth({
          isAuthenticated: true,
          user: {
            emai: res?.email,
            name: res?.name,
            id: res?.id
          }
        })
      } else {
        notification.error({
          message: res.message,
          description: res?.EM ?? "Đã có lỗi xảy ra",
        });
      }
      setAppLoading(false);
    }
    fetchAccount();
  }, [])
  return (
    <>
      {appLoading ?
          <Spin fullscreen /> :
        <>
          <Header />
          <Outlet />
        </>
      }
    </>
  )
}

export default App
