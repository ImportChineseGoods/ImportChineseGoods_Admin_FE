import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const SiderWeb = () => {
  const [visible, setVisible] = useState(true);

  const location = useLocation();
  const currentPath = location.pathname.split('/')[1];

  const items = [
    {
      key: 'overview',
      icon: <PieChartOutlined />,
      label: <Link to="/overview">Tổng quan</Link>,
    },
    {
      key: 'shopping',
      icon: <UserOutlined />,
      label: 'Đặt hàng',
      children: [
        {
          key: 'create-product',
          label: <Link to="/create-product">Thêm sản phẩm</Link>,
        },
        {
          key: 'cart',
          label: <Link to="/cart">Giỏ hàng</Link>,
        },
        {
          key: 'import-consignment',
          label: <Link to="/import-consignment">Tạo đơn ký gửi</Link>,
        },
      ],
    },
    {
      key: 'orders',
      icon: <DesktopOutlined />,
      label: <Link to="/orders">Đơn đặt hàng</Link>,
    },
    {
      key: 'consignments',
      icon: <DesktopOutlined />,
      label: <Link to="/consignments">Đơn ký gửi</Link>,
    },
    {
      key: 'payment',
      icon: <TeamOutlined />,
      label: 'Ví điện tử',
      children: [
        {
          key: 'deposits',
          label: <Link to="/deposits">Nạp tiền</Link>,
        },
        {
          key: 'withdraws',
          label: <Link to="/withdraws">Rút tiền</Link>,
        },
        {
          key: 'transactions',
          label: <Link to="/transactions">Lịch sử giao dịch</Link>,
        },
      ],
    },
    {
      key: 'complaints',
      icon: <FileOutlined />,
      label: <Link to="/complaints">Khiếu nại</Link>,
    },
  ];

  return (
    <Sider className="layouSider">
      <Menu
        theme="dark"
        selectedKeys={[currentPath]}
        mode="inline"
        items={items}
      />
    </Sider>
  );
};

export default SiderWeb;
