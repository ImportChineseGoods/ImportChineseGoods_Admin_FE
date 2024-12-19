import { orderApi } from '@api/orderApi';
import { Button, Flex, Form, Input, InputNumber, notification, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { use } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderManagement({ data, locked }) {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState('false');
    const contractCode = Form.useWatch('contract_code', form);
    const actualPayment = Form.useWatch('actual_payment_amount', form);
    const chinaFee = Form.useWatch('china_shipping_fee', form);

    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const statusList = ['waiting_deposit', 'deposited', 'ordering']
    const isOrdered = !statusList.includes(data.status);
    const isDeposited = data.status !== 'waiting_deposit';

    useEffect(() => {
        setShowAdditionalFields(!!contractCode);
    }, [contractCode]);

    const setFormValues = () => {
        if (data) {
            form.setFieldsValue({
                purchase_discount: parseFloat(data.purchase_discount) || 0,
                shipping_discount: parseFloat(data.shipping_discount) || 0,
                packing_fee: parseInt(data.packing_fee) || 0,
                counting_fee: parseInt(data.counting_fee) || 0,
                weight: parseFloat(data.weight) || 0,
                incurred_fee: parseInt(data.incurred_fee) || 0,
                contract_code: data.contract_code || '',
                commodity_money: parseFloat(data.commodity_money) || 0,
                china_shipping_fee: parseFloat(data.china_shipping_fee) || 0,
                actual_payment_amount: parseFloat(data.actual_payment_amount) || parseFloat(data.commodity_money) + parseFloat(data.china_shipping_fee),
                negotiable_money: parseFloat(data.negotiable_money) || 0,
                bol_code: data.bol?.bol_code || '',
                note: data.note || '',
            });
        }
    };

    useEffect(() => {
        form.setFieldsValue({
            negotiable_money: chinaFee + data.commodity_money - actualPayment
        });
    }, [chinaFee, actualPayment]);

    useEffect(() => {
        form.setFieldsValue({
            actual_payment_amount: data.commodity_money + chinaFee,
        });
    }, [chinaFee])

    useEffect(() => {
        setFormValues();
    }, [data, form]);

    const handleReset = () => {
        setFormValues();
    };

    const handleUpdate = async(values) => {
        setLoading(true);
        if (values.contract_code && values?.contract_code !== data.contract_code) {
            const res = await orderApi.assignContractCode(data.id, values.contract_code);
            if (res.status !== 200) {
                notification.error({
                    message: 'Lỗi khi gán mã hợp đồng',
                    description: res?.RM || 'Vui lòng thử lại.',
                }); 
                return;
            }
        }

        if (values.bol_code && values.bol_code !== data.bol?.bol_code) {
            const res = await orderApi.assignBOL(data.id, values.bol_code);
            if (res.status !== 200) {
                notification.error({
                    message: 'Lỗi khi gán mã vận đơn',
                    description: res?.RM || 'Vui lòng thử lại.',
                }); 
                return;
            }
        }

        const res = await orderApi.updateOrder(data.id, {
            purchase_discount: values.purchase_discount,
            shipping_discount: values.shipping_discount,
            packing_fee: values.packing_fee,
            counting_fee: values.counting_fee,
            weight: values.weight,
            incurred_fee: values.incurred_fee,
            china_shipping_fee: values.china_shipping_fee,
            actual_payment_amount: values.actual_payment_amount,
            negotiable_money: values.negotiable_money,
            note: values.note,
        });
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
            navigate(0); // Reload trang
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
                    label="CK phí mua hàng (%)"
                    name="purchase_discount"
                    rules={[
                        {
                            required: true,
                            message: 'Hãy nhập CK phí mua hàng!',
                        },
                    ]}
                >
                    <InputNumber style={{ width: '100%' }} min={0} max={100} />
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
                    label="Phí đóng gói (đ)"
                    name="packing_fee"
                    rules={[
                        {
                            required: true,
                            message: 'Hãy nhập phí đóng gói!',
                        },
                        {
                            type: 'integer',
                            message: 'Phí đóng gói phải là số nguyên!',
                        }
                    ]}
                >
                    <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>

                <Form.Item
                    label="Phí kiểm đếm"
                    name="counting_fee"
                    rules={[
                        {
                            required: true,
                            message: 'Hãy nhập phí kiểm đếm!',
                        },
                        {
                            type: 'integer',
                            message: 'Phí đóng gói phải là số nguyên!',
                        }
                    ]}
                >
                    <InputNumber style={{ width: '100%' }} min={0} suffix='đ' />
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

                {isDeposited && <Form.Item
                    label="Mã hợp đồng"
                    name="contract_code"
                    rules={[
                        {
                          pattern: /^[a-zA-Z0-9]+$/,
                          message: 'Mã hợp đồng chỉ được chứa chữ cái và số, không được có dấu cách hoặc ký tự đặc biệt',
                        },
                      ]}
                >
                    <Input style={{ width: '100%' }} placeholder="Nhập mã hợp đồng" />
                </Form.Item>
                }

                {showAdditionalFields && (
                    <>
                        <Form.Item
                            label="Tiền hàng (¥)"
                            name="commodity_money"
                        >
                            <InputNumber style={{ width: '100%' }} disabled />
                        </Form.Item>
                        <Form.Item
                            label="Phí ship nội địa (¥)"
                            name="china_shipping_fee"
                            rules={[{ required: true, message: 'Hãy nhập phí ship nội địa!' }]}
                        >
                            <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>

                        <Form.Item
                            label="Thanh toán thực (¥)"
                            name="actual_payment_amount"
                            rules={[{ required: true, message: 'Hãy nhập số tiền thanh toán thực!' }]}
                        >
                            <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>

                        <Form.Item
                            label="Tiền thương lượng (¥)"
                            name="negotiable_money"
                        >
                            <InputNumber style={{ width: '100%' }} disabled />
                        </Form.Item>
                    </>
                )}

                {isOrdered && <Form.Item
                    label="Mã vận đơn"
                    name="bol_code"
                >
                    <Input style={{ width: '100%' }} placeholder="Nhập mã vận đơn" />
                </Form.Item>
                }


                <Form.Item
                    label="Ghi chú"
                    name="note"
                >
                    <Input.TextArea style={{ width: '100%' }} placeholder="Nhập ghi chú" />
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
