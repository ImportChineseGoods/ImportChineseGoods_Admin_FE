
import { transactionApi } from '@api/transactionApi';
import statusTagMapping from '@components/components/tag';
import formatDate from '@helpers/formatDate';
import { formatUnit } from '@helpers/formatUnit';
import { Breadcrumb, Button, Divider, Flex, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function Transactions() {
  const [transations, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const query = {}
      const res = await transactionApi.queryTransaction(query, page, pageSize);
      if (res.status === 200) {
        setTransactions(res.transactions.rows.map((order, index) => ({ ...order, key: index + 1 })));
        setTotal(res.transactions.count);
      } else {
        notification.error({
          message: 'Lỗi khi lấy dữ liệu',
          description: res.RM || 'Vui lòng thử lại.',
        });
      }
      setLoading(false);
    };
    fetchTransactions();
  }, []);

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

  const handlePageChange = (newPage, newPageSize) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
  };

  console.log(transations)


  const startResult = (page - 1) * pageSize + 1;
  const endResult = Math.min(page * pageSize, total);


  const columns = [
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
      render: (employee) => employee?.name,
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
    <div>
      <Breadcrumb
        items={[
          {
            title: <Link to="/">Trang chủ</Link>,
          },
          {
            title: 'Lịch sử giao dịch',
          },
        ]}
      />
      <Divider></Divider>
      <Flex justify='space-between' align='center'>
        <p>Hiển thị từ {startResult} đến {endResult} trong tổng {total} kết quả</p>
        <div>
          Hiển thị:
          <Select
            defaultValue="10"
            style={{ width: 120 }}
            onChange={handlePageSizeChange}
            options={[
              { value: '10', label: '10 / page' },
              { value: '20', label: '20 / page' },
              { value: '50', label: '50 / page' },
            ]}
          />
        </div>
      </Flex>

      <Table
        columns={columns}
        dataSource={transations}
        bordered
        pagination={{
          current: page,
          pageSize: pageSize || 50,
          total: total,
          onChange: (newPage, newPageSize) => handlePageChange(newPage, newPageSize),
        }}
      />
    </div>
  )
}

export default Transactions