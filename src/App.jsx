import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Header from "@components/layout/header"; // Header component
import SiderWeb from "@components/layout/sider"; // Sider component


function App() {
  return (
    <Layout className="layout">
      <SiderWeb />
      <Layout className="layoutBody">
        <Header />
        <Layout className="layoutContent">
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;
