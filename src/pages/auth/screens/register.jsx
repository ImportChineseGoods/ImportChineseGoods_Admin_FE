import { Button, Flex, Form, Input, notification } from 'antd';
import React from 'react';
import { customerApi } from '@api/customerApi';
import { Navigate, useNavigate } from 'react-router-dom';
import '@assets/styles/index.css';


const RegisterScreen = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const { name, phone, email, password } = values;

        const res = await customerApi.createCustomer(name, phone, email, password);

        if (res.status === 200) {
            notification.success({
                message: 'Đăng ký thành công',
                description: 'Chuyển đến trang đăng nhập'
            })
            navigate('/auth/login')
        } else {
            notification.error({
                message: 'Đăng ký thất bại',
                description: res?.RM ?? "error"
            })
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <Flex vertical gap="middle" justify="center" align="center" style={{ height: '100vh' }}>
            <h2>Đăng ký tài khoản</h2>
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
                    label="Họ và tên"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Hãy nhập họ và tên của bạn',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: 'Hãy nhập số điện thoại của bạn',
                        },
                    ]}
                >
                    <Input type='tel' />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Hãy nhập email" của bạn',
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

                <Form.Item
                >
                    <Flex vertical>
                        <Flex align='center'>
                            <Button type="link" onClick={() => navigate('/auth/login')}>
                                Bạn đã có tài khoản? Đăng nhập
                            </Button>
                        </Flex>
                        <Button type="primary" htmlType="submit">
                            Đăng ký
                        </Button>

                    </Flex>

                </Form.Item>
            </Form>
        </Flex>
    )
}

export default RegisterScreen;