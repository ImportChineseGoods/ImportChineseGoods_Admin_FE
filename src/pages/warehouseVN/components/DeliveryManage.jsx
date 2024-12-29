import { deliveryApi } from '@api/deliverynoteApi'
import { Button, Flex, Form, Input, InputNumber, notification, Select } from 'antd'
import React, { useEffect, useState } from 'react'

function DeliveryManage({ setData, customer, selectedRowKeys, setSelectedRowKeys, selectedRows, setSelectedRows }) {
    const [form] = Form.useForm()

    const [number, setNumber] = useState(selectedRowKeys.length)
    const [weight, setWeight] = useState(selectedRows.reduce((acc, cur) => acc + cur.weight, 0))
    const [totalAmount, setTotalAmount] = useState(selectedRows.reduce((acc, cur) => acc + cur.total_amount, 0))
    const [amountPaid, setAmountPaid] = useState(selectedRows.reduce((acc, cur) => acc + cur.amount_paid, 0))
    const [outstandingAmount, setOutstandingAmount] = useState(selectedRows.reduce((acc, cur) => acc + cur.outstanding_amount, 0))
    const [incurredFee, setIncurredFee] = useState(0)


    const handleIncurredFeeChange = (value) => {
        setIncurredFee(value);
        setTotalAmount(value + amountPaid);
    };

    const onFinish = async (values) => {
        const data = {
            ...customer,
            number: values.number,
            weight: values.weight,
            total_amount: values.totalAmount,
            amount_paid: values.amountPaid,
            outstanding_amount: values.outstandingAmount,
            incurred_fee: values.incurredFee,
            note: values.note,
            orders: selectedRows,
        }

        const response = await deliveryApi.create(data)
        if (response.status === 200) {
            notification.success({
                message: 'Tạo phiếu xuất kho thành công',
            })

            setData()
            form.resetFields()
        } else {
            notification.error({
                message: 'Tạo phiếu xuất kho thất bại',
                description: response?.RM || 'Vui lòng thử lại',
            })
        }
    }

    useEffect(() => {
        setNumber(selectedRowKeys.length)
        setWeight(selectedRows.reduce((acc, cur) => acc + cur.weight, 0))
        setTotalAmount(selectedRows.reduce((acc, cur) => acc + cur.total_amount, 0) + incurredFee) 
        setAmountPaid(selectedRows.reduce((acc, cur) => acc + cur.amount_paid, 0))
    }, [selectedRowKeys, selectedRows])

    useEffect(() => {       
        setTotalAmount(selectedRows.reduce((acc, cur) => acc + cur.total_amount, 0) + incurredFee) 
    }   , [incurredFee])

    useEffect(() => {
        form.setFieldsValue({ 
            number, 
            outstandingAmount: totalAmount - amountPaid,
            weight, 
            totalAmount, 
            amountPaid, 
            outstandingAmount, 
            incurredFee
        })    
    }, [number, weight, totalAmount, amountPaid, incurredFee])

    return (
        <Form
            form={form}
            name="manage-delivery"
            onFinish={onFinish}
        >
            <Flex vertical style={{ width: '100%' }} >
                <Form.Item
                    label="Số đơn đã chọn"
                    name="number"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="Tổng cân nặng (kg)"
                    name="weight"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="Phí phát sinh (đ)"
                    name="incurredFee"
                >
                    <InputNumber onChange={(value) => setIncurredFee(value)} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Tổng tiền (đ)"
                    name="totalAmount"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="Đã thanh toán (đ)"
                    name="amountPaid"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="Còn nợ (đ)"
                    name="outstandingAmount"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="Ghi chú"
                    name="note"
                >
                    <Input.TextArea />
                </Form.Item>
            </Flex>
            <Flex gap='20px' justify='end'>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Tạo phiếu xuất kho
                    </Button>
                </Form.Item>
            </Flex>
        </Form>
    )
}

export default DeliveryManage