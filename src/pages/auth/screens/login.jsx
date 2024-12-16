import { Button, Form, Flex, Input, notification } from 'antd';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@generals/contexts/authcontext'; // Import AuthContext
import { employeeApi } from '@api/employeeApi';

const LoginScreen = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext); // Lấy setAuth từ context

  const onFinish = async (values) => {
    const { username, password } = values;

    const res = await employeeApi.loginEmployee(username, password);

    if (res?.status === 200) {
      localStorage.setItem('access_token', res.access_token);
      localStorage.setItem('user', JSON.stringify(res?.user)); // Lưu thông tin user

      notification.success({
        message: 'Đăng nhập thành công',
        description: ''
      });

      // Cập nhật context
      setAuth({
        isAuthenticated: true,
        user: {
          name: res?.user?.name,
          username: res?.user?.username,
          id: res?.user?.id,
          avatar: res?.user?.avatar,
          role: res?.user?.role
        }
      });

      navigate('/');
    } else {
      notification.error({
        message: 'Đăng nhập thất bại',
        description: res?.RM ?? "error"
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Flex vertical gap="middle" justify="center" align="center" style={{ height: '100vh' }}>
      <h2>Đăng nhập</h2>
      <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout='vertical'
        style={{ width: '500px' }}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Hãy nhập tên đăng nhập',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Hãy nhập mật khẩu',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Flex vertical>
            <Button type="primary" htmlType="submit">
              Đăng nhập
            </Button>

          </Flex>

        </Form.Item>
      </Form>
    </Flex>
  );
};

export default LoginScreen;
