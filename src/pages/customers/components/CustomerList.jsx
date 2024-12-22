import React, { useContext, useEffect, useState } from 'react';
import { Table, Button, Typography, Image, Space, Flex, notification, Popover, Modal, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { formatUnit } from '@helpers/formatUnit';
import formatDate from '@helpers/formatDate';
import { AuthContext } from '@generals/contexts/authcontext';
const { Text, Link } = Typography;

const CustomersList = ({ data, total, loading, page, pageSize, onPageChange }) => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [customers, setCustomers] = useState(
        data.map((customer, index) => ({ ...customer, key: index + 1 }))
    );
    useEffect(() => {
        setCustomers(
            data.map((customer, index) => ({ ...customer, key: index + 1 }))
        );
    }, [data]);

    const isAdmin = auth?.user?.role === 'admin' || auth?.user?.role === 'accountant';

    const columns = [
        {
            title: 'STT',
            dataIndex: 'key',
            rowScope: 'row',
            render: (text, record) => {
                page = page || 1;
                pageSize = pageSize || 1000;
                return (page - 1) * pageSize + record.key;
            },
            width: '4%'
        },
        {
            title: 'Khách hàng',
            render: (_, render) => {
                return (
                    <Flex vertical>
                        <Text>{render.name}</Text>
                        <Text>{render.id}</Text>
                        <Text>Sales: {render.sales ? render.sales.name : null}</Text>
                    </Flex>
                );
            },
            width: '15%'
        },
        isAdmin && {
            title: 'Số dư',
            dataIndex: 'balance',
            render: (balance) => formatUnit.moneyVN(balance),
        },
        {
            title: 'Thông tin',
            render: (_, record) => {
                return (
                    <Flex justify='space-between'>
                        <Flex vertical>
                            <Text>Email:</Text>
                            <Text>Điện thoại:</Text>
                            <Text>Địa chỉ:</Text>
                            <Text type="warning">Tiền tích lũy:</Text>
                            <Text>Ngày tạo:</Text>
                            <Text>Ngày cập nhật:</Text>
                        </Flex>
                        <Flex vertical justify='flex-end' style={{ textAlign: 'end' }}>
                            <Text>{record.email}</Text>
                            <Text>{record.phone}</Text>
                            <Text>{record.address || '_'}</Text>
                            <Text type="warning">{formatUnit.moneyVN(record.accumulation)}</Text>
                            <Text>{formatDate(record.create_at)}</Text>
                            <Text>{formatDate(record.update_at)}</Text>
                        </Flex>
                    </Flex>

                );
            }
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            // width: '30%',
        },
        {
            title: 'Bảng phí',
            render: (_, record) => {
                return (
                    <Flex vertical>
                        <Text>Tỉ lệ cọc: {formatUnit.percent(record.deposit_rate)}</Text>
                        <Text>Ck mua hàng: {formatUnit.percent(record.purchase_discount)}</Text>
                        <Text>Ck vận chuyển: {formatUnit.percent(record.shipping_discount)}</Text>
                    </Flex>
                );
            }
        },
        isAdmin && {
            title: 'Thao tác',
            width: '100px',
            key: 'action',
            render: (_, record) => {
                return (
                    <Space size="middle" direction='vertical' align='center'>
                        {isAdmin && (
                            <Button color="primary" variant="filled" onClick={() => navigate(`/customers-list/update/${record.id}`)}>
                                Cập nhật
                            </Button>
                        )}
                        <Button type="primary" onClick={() => navigate(`/customers-list/transactions/${record.id}`)}>
                            Xem LSGD
                        </Button>

                    </Space>
                );
            },
        }
    ].filter(Boolean);

    return (
        <Table
            columns={columns}
            bordered
            dataSource={customers}
            pagination={{
                current: page,
                pageSize: pageSize || 1000,
                total: total,
                onChange: (newPage, newPageSize) => onPageChange(newPage),
            }}
            loading={loading}
        />
    );
};

export default CustomersList;
