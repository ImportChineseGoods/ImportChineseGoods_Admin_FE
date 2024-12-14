import { Button, Checkbox, Form, Input, notification } from 'antd';
import React from 'react';
import { customerApi } from '@api/customerApi';
import { useNavigate } from 'react-router-dom';
import '@assets/styles/index.css';


const RegisterScreen = () => {
    const navigate = useNavigate();

    const onFinish = async(values) => {
        const { name, phone, email, password } = values;

        const res = await customerApi.createCustomer(name, phone, email, password);
    
        if (res) {
            notification.success({
                message: 'Đăng ký thành công',
                description: 'Chuyển đến trang đăng nhập'
            })
            navigate('/login');
        } else {
            notification.error({
                message: 'Đăng ký thất bại',
                description: 'Đã có lỗi xảy ra, vui lòng thử lại'
            })
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className='center-div'>
            <Form
                name="basic"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout='vertical'
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
                    <Input />
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
                    <Button type="primary" htmlType="submit">
                        Đăng ký
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default RegisterScreen;