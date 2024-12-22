import { Breadcrumb, Button, Divider, Flex, Form, Input, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const FormEmployee = ({ data, handleSubmit, loading }) => {
    const [form] = Form.useForm();
    const [lock, setLock] = useState(true);

    useEffect(() => {
        setLock(true);
        if (data) form.setFieldsValue(data)
        setLock(loading)
    }, [data, form, loading]);

    const options = [
        { label: 'Quản lý', value: 'admin' },
        { label: 'Kế toán', value: 'accountant' },
        { label: 'Nhân viên bán hàng', value: 'sales' },
        { label: 'Nhân viên đặt hàng', value: 'order' },
        { label: 'Nhân viên kho', value: 'warehouse' }
    ]

    return (
        <Flex vertical gap='20px' className='detailBox' style={{ width: '60%', minWidth: '200px' }}>
            <div style={{ textAlign: 'center' }}>
                {data ? <h3>Cập nhật nhân viên {data.username}</h3> : <h3>Thêm nhân viên</h3>}
            </div>
            <Form
                form={form}
                style={{ width: '100%' }}
                onFinish={handleSubmit}
                initialValues={data}
                disabled={lock}
            >

                <Form.Item
                    label="Họ và tên"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                >
                    <Input placeholder='Nhập họ và tên' />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                          type: 'email',
                          message: 'Nhập đúng định dạng email!',
                        },
                        {
                          required: true,
                          message: 'Please input your E-mail!',
                        },
                      ]}
                >
                    <Input type='email' placeholder='Nhập email' />
                </Form.Item>
                <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                >
                    <Input type='tel' placeholder='Nhập số điện thoại' />
                </Form.Item>
                {!data && <>
                    <Form.Item
                        label="Tên đăng nhập"
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
                    >
                        <Input placeholder='Nhập tên đăng nhập' />
                    </Form.Item>
                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                    >
                        <Input.Password placeholder='Nhập mật khẩu' />
                    </Form.Item>
                    <Form.Item
                        label="Xác nhận mật khẩu"
                        name="repassword"
                        dependencies={['password']}
                        rules={[
                            { 
                                required: true, 
                                message: 'Vui lòng nhập lại mật khẩu' 
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(new Error('Mật khẩu không khớp!'));
                                },
                              }),
                        ]}
                    >
                        <Input.Password placeholder='Nhập lại mật khẩu' />
                    </Form.Item>
                </>

                }
                <Form.Item
                    label="Chức vụ"
                    name="role"
                    rules={[{ required: true, message: 'Vui lòng nhập chức vụ' }]}
                >
                    <Select
                        options={options}
                        placeholder='Chọn chức vụ'
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </Flex>
    )
}

export default FormEmployee