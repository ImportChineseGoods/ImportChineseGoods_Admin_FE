import React, { useContext } from 'react';
import { DownOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '@generals/contexts/authcontext';
import { AppResource } from '@generals/constants/AppResource';
import { formatUnit } from '@helpers/formatUnit';

const Header = () => {
  const navigate = useNavigate();
  const { auth, applicableRate } = useContext(AuthContext);

  const items = [
    {
      label: <Link to="/information?tab=profile">Thông tin cá nhân</Link>,
      key: 'profile',
      icon: <UserOutlined />,
    },
    {
      label: <Link to="/information?tab=change-password">Đổi mật khẩu</Link>,
      key: 'change-password',
      icon: <SettingOutlined />,
    },
    {
      label: (
        <span
          onClick={() => {
            const token = localStorage.getItem('access_token');
            fetch('/api/logout', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            })
              .then(() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                navigate('/');
                window.location.reload();
              })
              .catch((err) => console.error(err));
          }}
        >
          Đăng xuất
        </span>
      ),
      key: 'logout',
      icon: <LogoutOutlined />,
    },
  ]

  return (
    <div className="layoutHeader" >
      <div className='layoutLogo'>
        <div className="logo"><img src={AppResource.logo} alt="logo" /></div>
        <p>Tỷ giá: {formatUnit.moneyVN(applicableRate)}</p>
      </div>
      <Dropdown
        menu={{
          items,
        }}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            {auth.user.avatar ? <Avatar src={auth.user.avatar} /> : <Avatar icon={<UserOutlined />}/>}
            {auth?.user?.name}
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </div>

  );
};

export default Header;
