import { transactionApi } from '@api/transactionApi';
import statusTagMapping from '@components/components/tag';
import formatDate from '@helpers/formatDate';
import { formatUnit } from '@helpers/formatUnit';
import { Button, Table } from 'antd';
import React, { useEffect, useState } from 'react'

const TransactionHistory = ({ data, total, loading, page, pageSize, onPageChange }) => {
    console.log(page, pageSize);
    const [transations, setTransactions] = useState(
        data.map((transation, index) => ({ ...transation, key: index + 1 }))
    );
    useEffect(() => {
        setTransactions(
            data.map((transation, index) => ({ ...transation, key: index + 1 }))
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
            title: 'Mã giao dịch',
            dataIndex: 'id',
        },
        {
            title: 'Khách hàng',
            dataIndex: 'customer',
            render: (customer) => {
                return (
                    <p>{customer.id} - {customer.name}</p>
                );
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'create_at',
            render: (create_at) => formatDate(create_at),
        },
        {
            title: 'Số tiền',
            dataIndex: 'value',
            render: (value) => formatUnit.moneyVN(value),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => {
                const StatusTag = statusTagMapping[status];
                return StatusTag ? <StatusTag /> : null;
            },
        },
    ];
    return (
        <Table
            columns={columns}
            dataSource={transations}
            bordered
            pagination={{
                current: page,
                pageSize: pageSize || 1000,
                total: total,
                onChange: (newPage, newPageSize) => onPageChange(newPage, newPageSize),
            }}
            loading={loading}
        />
    )
}

export default TransactionHistory