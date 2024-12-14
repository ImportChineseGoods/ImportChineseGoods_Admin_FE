import { Breadcrumb, Divider, Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Information from './components/Information';
import ChangePassword from './components/ChangePassword';

function InfoPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile'); // Mặc định là profile

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get('tab'); // Lấy giá trị tab từ URL
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]); // Mỗi khi URL thay đổi, kiểm tra lại giá trị tab

  const onChange = (key) => {
    setActiveTab(key);
  };

  const items = [
    {
      label: 'Thông tin tài khoản',
      key: 'profile',
      children: <Information />,
    },
    {
      label: 'Đổi mật khẩu',
      key: 'change-password',
      children: <ChangePassword />,
    },
  ];

  return (
    <div>
      <Breadcrumb
        items={[
          {
            title: <Link to="/">Trang chủ</Link>,
          },
          {
            title: activeTab === 'profile' ? 'Thông tin tài khoản' : 'Đổi mật khẩu',
          },
        ]}
      />
      <Divider />
      <Tabs
        onChange={onChange}
        activeKey={activeTab}
        items={items}
      />
    </div>
  );
}

export default InfoPage;
