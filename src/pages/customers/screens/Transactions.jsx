
import { transactionApi } from '@api/transactionApi';
import statusTagMapping from '@components/components/tag';
import formatDate from '@helpers/formatDate';
import { formatUnit } from '@helpers/formatUnit';
import { Breadcrumb, Button, Divider, Flex, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import TransactionsAll from '../components/TransactionsAll';

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

  const startResult = (page - 1) * pageSize + 1;
  const endResult = Math.min(page * pageSize, total);

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
            onChange={(value) => {
              setPageSize(value);
            }}
            options={[
              { value: '10', label: '10 / page' },
              { value: '20', label: '20 / page' },
              { value: '50', label: '50 / page' },
            ]}
          />
        </div>
      </Flex>

      <TransactionsAll
        data={transations}
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        loading={loading}
      />
    </div>
  )
}

export default Transactions