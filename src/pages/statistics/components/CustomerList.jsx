import React, { useEffect, useState } from 'react';
import { Table, Button, Typography, Image, Space, Flex, notification, Popover, Modal, Tag } from 'antd';
import statusTagMapping from '@components/components/tag';
import { Link, useNavigate } from 'react-router-dom';
import { formatUnit } from '@helpers/formatUnit';
import { orderApi } from '@api/orderApi';
import formatDate from '@helpers/formatDate';
const { Text } = Typography;

const CustomerList = ({ data, total, loading, page, pageSize, onPageChange }) => {
    const navigate = useNavigate();

    const [customers, setCustomers] = useState(
        data.map((order, index) => ({ ...order, key: index + 1 }))
    );
    useEffect(() => {
        setCustomers(
            data.map((order, index) => ({ ...order, key: index + 1 }))
        );
    }, [data]);

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
            dataIndex: 'id',
            render: (_, record) => {
                return (
                    <Flex vertical>
                        <Link to={`/customers-list/update/${record.id}`}>{record.id}</Link>
                        <Text>{record.name}</Text>
                    </Flex>
                    

                )
            }
        },
        {
            title: 'Nhân viên phụ trách',
            dataIndex: 'sales',
            render: (sales) => sales?.name || '_',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
        },
        {
            title: 'Tiền tích lũy',
            dataIndex: 'accumulation',
            render: (accumulation) => formatUnit.moneyVN(accumulation),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'create_at',
            render: (create_at) => formatDate(create_at),
        },
        {
            title: 'Số dư',
            dataIndex: 'balance',
            render: (balance) => formatUnit.moneyVN(balance),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={customers}
            bordered
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

export default CustomerList;
