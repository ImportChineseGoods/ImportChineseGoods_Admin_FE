import { transactionApi } from '@api/transactionApi';
import statusTagMapping from '@components/components/tag';
import formatDate from '@helpers/formatDate';
import { formatUnit } from '@helpers/formatUnit';
import { Button, Table } from 'antd';
import React, { useEffect, useState } from 'react'

const TransactionHistory = ({ data, total, loading, page, pageSize, onPageChange }) => {
    const [transations, setTransactions] = useState(
        data.map((transation, index) => ({ ...transation, key: index + 1 }))
    );
    useEffect(() => {
        setTransactions(
            data.map((transation, index) => ({ ...transation, key: index + 1 }))
        );
    }, [data]);

    const handleCancel = async (record) => {
        const response = await transactionApi.cancelTransaction(record.id);
        if (response.status === 200) {
            notification.success({
                message: 'Hủy yêu cầu rút tiền thành công',
                description: response?.RM || '',
            });
            setTransactions((prevTransactions) =>
                prevTransactions.map((transaction) =>
                    transaction.id === record.id ? { ...transaction, status: 'cancelled' } : transaction
                )
            );
        } else {
            notification.error({
                message: 'Hủy yêu cầu rút tiền thất bại',
                description: response?.RM || '',
            });
        }
    };

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
        {
            title: 'Thao tác',
            width: '100px',
            key: 'action',
            render: (_, record) => {
                const visibleStatus = ['processing']
                const visible = visibleStatus.includes(record.status);
                return (
                    <div>
                        {visible && (
                            <Button color="danger" variant="filled" onClick={() => handleCancel(record)}>
                                Hủy
                            </Button>
                        )}
                    </div>

                );
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