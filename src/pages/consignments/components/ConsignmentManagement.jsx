import { consignmentApi } from '@api/consignmentApi';
import { Button, Flex, Form, Input, InputNumber, notification, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ConsignmentManagement({ data, locked }) {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const setFormValues = () => {
        if (data) {
            form.setFieldsValue({
                shipping_discount: parseFloat(data.shipping_discount) || 0,
                weight: parseFloat(data.weight) || 0,
                incurred_fee: parseInt(data.incurred_fee) || 0,
                note: data.note,
            });
        }
    };

    useEffect(() => {
        setFormValues();
    }, [data, form]);

    const handleReset = () => {
        setFormValues();
    };

    const handleUpdate = async(values) => {
        const res = await consignmentApi.updateConsignment(data.id,values);
        if (res.status !== 200) {
            notification.error({
                message: 'Lỗi khi cập nhật đơn hàng',
                description: res?.RM || 'Vui lòng thử lại.',
            });
            return;
        }
        notification.success({
            message: 'Cập nhật thành công',
            description: 'Dữ liệu đơn hàng đã được cập nhật.',
        });

        setTimeout(() => {
            navigate(0);
        }, 1000);
    }

    return (
        <Flex vertical gap='20px' style={{ marginTop: '20px' }}>
            <Form
                form={form}
                style={{ width: '100%' }}
                onFinish={handleUpdate}
                disabled={locked}
            >
                <Form.Item
                    label="Cân nặng (kg)"
                    name="weight"
                    rules={[
                        {
                            required: true,
                            message: 'Hãy nhập cân nặng!',
                        },
                    ]}
                >
                    <InputNumber style={{ width: '100%' }} min={0}/>
                </Form.Item>
                
                <Form.Item
                    label="CK phí vận chuyển (%)"
                    name="shipping_discount"
                    rules={[
                        {
                            required: true,
                            message: 'Hãy nhập CK phí vận chuyển!',
                        },
                    ]}
                >
                    <InputNumber style={{ width: '100%' }} min={0} max={100} />
                </Form.Item>

                <Form.Item
                    label="Phí phát sinh"
                    name="incurred_fee"
                    rules={[
                        {
                            required: true,
                            message: 'Hãy nhập phí phát sinh!',
                        },

                    ]}
                >
                    <InputNumber style={{ width: '100%' }} min={0} suffix={'đ'} />
                </Form.Item>

                <Form.Item
                    label="Ghi chú"
                    name="note"
                >
                    <Input.TextArea style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item>
                    <Flex justify='end' gap="middle">
                        <Button type="primary" htmlType="submit">
                            Cập nhật
                        </Button>
                        <Button onClick={handleReset}>Hủy thay đổi</Button>
                    </Flex>
                </Form.Item>
            </Form>
        </Flex>
    );
}
