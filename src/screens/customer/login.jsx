import { Button, Checkbox, Form, Input, notification } from 'antd';
import React, { useContext } from 'react';
import { loginCustomerApi } from '../../util/api';
import { useNavigate } from 'react-router-dom';
import '../../styles/index.css';
import { AuthContext } from '../../components/context/authcontext';

const LoginScreen = () => {
    const navigate = useNavigate();

    const { setAuth } = useContext(AuthContext);

    const onFinish = async (values) => {
        const { email, password } = values;

        const res = await loginCustomerApi(email, password);
        // debugger;
        if (res && res.EC == 0) {
            localStorage.setItem('access_token', res.access_token);
            notification.success({
                message: 'Đăng nhập thành công',
                description: ''
            })

            setAuth({
                isAuthenticated: true,
                user: {
                    emai: res?.user?.email,
                    name: res?.user?.name,
                    id: res?.user?.id   
                }
            })
            navigate('/');
        } else {
            notification.error({
                message: 'Đăng nhập thất bại',
                description: res?.EM ?? "error"
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
                    name="remember"
                    valuePropName="checked"
                >
                    <Checkbox>Lưu đăng nhập</Checkbox>
                </Form.Item>

                <Form.Item
                >
                    <Button type="primary" htmlType="submit">
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default LoginScreen;