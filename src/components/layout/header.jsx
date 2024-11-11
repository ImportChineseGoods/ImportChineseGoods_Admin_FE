import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authcontext';

const Header = () => {
    const navigate = useNavigate();
    const {auth} = useContext(AuthContext);
    console.log(auth);
    const items = [
        {
            label: <Link to="/">Homepage</Link>,
            key: 'home',
            icon: <MailOutlined />,
        },
        {
            label: <Link to="/inf">Giới thiệu</Link>,
            key: 'inf',
            icon: <MailOutlined />,
        },
        {
            label: <Link to="/price-list">Bảng giá</Link>,
            key: 'price',
            icon: <MailOutlined />,
        },
        // ...(auth?.isAuthenticated ? [
        //     {
        //         label: <Link to="/price-list">Bảng giá</Link>,
        //         key: 'price',
        //         icon: <MailOutlined />,
        //     }, 
        // ] : []),
        {
            label: `${auth?.user?.name}`,
            key: 'SubMenu',
            icon: <SettingOutlined />,
            children: [
                {
                    label: <Link to='/login'>Đăng nhập</Link>,
                    key: 'login',
                },
                {
                    label: <span onClick={() => {
                        localStorage.removeItem('access_token');
                        navigate('/');
                        window.location.reload();
                    }}>Đăng xuất</span>,
                    key: 'logout',
                },
            ],
        },
    ];

    const [current, setCurrent] = useState('home');
    const onClick = (e) => {
        setCurrent(e.key);
    };
    return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
};
export default Header;