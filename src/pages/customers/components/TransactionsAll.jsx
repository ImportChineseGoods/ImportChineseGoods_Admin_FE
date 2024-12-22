
import { transactionApi } from '@api/transactionApi';
import statusTagMapping from '@components/components/tag';
import formatDate from '@helpers/formatDate';
import { formatUnit } from '@helpers/formatUnit';
import { Breadcrumb, Button, Divider, Flex, Modal, notification, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';

function TransactionsAll({data, total, loading, page, pageSize, onPageChange}) {
  const [transations, setTransactions] = useState(
    data.map((transaction, index) => ({ ...transaction, key: index + 1 }))
  );

    useEffect(() => {
        setTransactions(
            data.map((transaction, index) => ({ ...transaction, key: index + 1 }))
        );
    }, [data]);

  const approveTransaction = async (record) => {
    const response = await transactionApi.approveTransaction(record.id);
    if (response.status === 200) {
      notification.success({
        message: 'Xác nhận yêu cầu rút tiền thành công',
        description: response?.RM || '',
      });
      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction.id === record.id ? { ...transaction, status: 'cancelled' } : transaction
        )
      );
    } else {
      notification.error({
        message: 'Xác nhận yêu cầu rút tiền thất bại',
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
        title: 'Khách hàng',
        dataIndex: 'customer',
        render: (customer) => {
            return (
                <p>{customer.id} - {customer.name}</p>
            );
        }
    },
    {
      title: 'Số tiền',
      dataIndex: 'value',
      render: (value) => formatUnit.moneyVN(value),
    },
    {
      title: 'Số dư sau giao dịch',
      dataIndex: 'balance_after',
      render: (balance_after) => formatUnit.moneyVN(balance_after),
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
      title: 'Loại giao dịch',
      dataIndex: 'type',
      render: (type) => {
        const typeMapping = {
          deposit: 'Nạp tiền',
          withdraw: 'Rút tiền',
          refund: 'Hoàn tiền',
          payment: 'Thanh toán',
        };
        return typeMapping[type];
      }
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
    },
    {
      title: 'Nhân viên xử lý',
      dataIndex: 'employee',
      render: (employee) => employee?.username,
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
              <Button type='primary' onClick={() => {
                Modal.confirm({
                  title: `Xác nhân duyệt lệnh rút tiền ${record.id}`,
                  content: 'Thao tác này không thể hoàn tác.',
                  okText: 'Xác nhận',
                  cancelText: 'Đóng',
                  footer: (_, { OkBtn, CancelBtn }) => (
                    <>
                      <CancelBtn />
                      <OkBtn />
                    </>
                  ),
                  onOk: () => approveTransaction(record),
                });
              }}>
                Duyệt
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
          pageSize: pageSize || 50,
          total: total,
          onChange: (newPage, newPageSize) => {
            onPageChange(newPage)
          }
        }}
        loading={loading}
      />
  )
}

export default TransactionsAll