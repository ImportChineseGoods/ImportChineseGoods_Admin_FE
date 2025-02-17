import React, { useContext, useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '@generals/contexts/authcontext';

const { Sider } = Layout;

const SiderWeb = () => {
  const { auth } = useContext(AuthContext); // Lấy thông tin auth từ context
  const userRole = auth.user?.role; // Lấy role của user

  const location = useLocation();
  const currentPath = location.pathname.split('/')[1];

  const isAdmin = userRole === 'admin' || userRole === 'accountant';
  const isOrder = userRole === 'order' || userRole === 'sales';
  const isWarehouse = userRole === 'warehouse';

  // Tạo items menu
  const items = [
    {
      key: 'menu',
      label: 'Menu',
      type: 'group',
      children: [
        {
          key: 'overview',
          icon: <PieChartOutlined />,
          label: <Link to="/overview">Tổng quan</Link>,
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
        !isWarehouse && {
          key: 'customers',
          icon: <TeamOutlined />,
          label: 'Khách hàng',
          children: [
            {
              key: 'customers-list',
              label: <Link to="/customers-list">Danh sách khách hàng</Link>,
            },
            isAdmin && {
              key: 'create-transactions',
              label: <Link to="/create-transactions">Nạp rút ví</Link>,
            },
            {
              key: 'transactions',
              label: <Link to="/transactions">Lịch sử giao dịch</Link>,
            },
          ],
        },
        isWarehouse && {
          key: 'customers-list',
          icon: <TeamOutlined />,
          label: <Link to="/customers-list">Danh sách khách hàng</Link>,
        },
        !isWarehouse && {
          key: 'complaints',
          icon: <DesktopOutlined />,
          label: <Link to="/complaints">Khiếu nại</Link>,
        },
        isOrder && {
          key: 'statistics',
          icon: <FileOutlined />,
          label: <Link to="/statistics/debt">Thống kê công nợ</Link>,
        },
        isAdmin && {
          key: 'statistics',
          icon: <FileOutlined />,
          label: 'Thống kê',
          children: [
            {
              key: 'revenue',
              label: <Link to="/statistics/revenue">Thống kê doanh thu</Link>,
            },
            {
              key: 'debt',
              label: <Link to="/statistics/debt">Thống kê công nợ</Link>,
            },
            {
              key: 'profit',
              label: <Link to="/statistics/profit">Thống kê lợi nhuận</Link>,
            },        
          ],
        },
      ].filter(Boolean), // Loại bỏ các mục null/undefined
    },
    {
      key: 'warehouse',
      label: 'Quản lý kho',
      type: 'group',
      children: [
        {
          key: 'warehouseTQ',
          icon: <UserOutlined />,
          label: 'Kho Trung',
          children: [
            {
              key: 'addWrehouseTQ',
              label: <Link to="/warehouse-tq/add">Nhập kho</Link>,
            },
            {
              key: 'manageBolTQ',
              label: <Link to="/warehouse-tq/management-bol">Quản lý mã vận đơn</Link>,
            },
          ],
        },
        {
          key: 'warehouseVN',
          icon: <TeamOutlined />,
          label: 'Kho Việt Nam',
          children: [
            {
              key: 'addWarehouseVN',
              label: <Link to="/warehouse-vn/add">Nhập kho</Link>,
            },
            {
              key: 'manageBolVN',
              label: <Link to="/warehouse-vn/management-bol">Quản lý mã vận đơn</Link>,
            },
            {
              key: 'createDeliveryNote',
              label: <Link to="/warehouse-vn/delivery-notes/create">Tạo phiếu xuất kho</Link>,
            },
            {
              key: 'delivery',
              label: <Link to="/warehouse-vn/delivery-notes">Quản lý phiếu xuất kho</Link>,
            },
          ],
        },
      ],
    },
    userRole === 'admin' && {
      key: 'account',
      label: 'Tài khoản',
      type: 'group',
      children: [
        {
          key: 'employees',
          icon: <TeamOutlined />,
          label: <Link to="/employees">Danh sách nhân viên</Link>,
        },
        {
          key: 'create-employee',
          icon: <TeamOutlined />,
          label: <Link to="/create-employee">Thêm nhân viên</Link>,
        },
      ],
    },
    userRole === 'admin' && {
      key: 'settings',
      label: 'Cài đặt hệ thống',
      type: 'group',
      children: [
        {
          key: 'parameters',
          icon: <PieChartOutlined />,
          label: <Link to="/parameters">Thông số chung</Link>,
        },
      ],
    },
  ].filter(Boolean);

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
