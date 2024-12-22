
import { transactionApi } from '@api/transactionApi';
import statusTagMapping from '@components/components/tag';
import formatDate from '@helpers/formatDate';
import { formatUnit } from '@helpers/formatUnit';
import TransactionsAll from '@pages/customers/components/TransactionsAll';
import { Breadcrumb, Button, DatePicker, Divider, Flex, Form, Input, Modal, notification, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

function Transactions() {
  const { customer_id } = useParams();
  const [transations, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState({
      status: 'all',
      dateRange: [dayjs().add(-30, 'd'), dayjs()],
      search: '',
    });
    const [query, setQuery] = useState({});
      const options = [
        {
          label: 'Chờ cọc',
          value: 'waiting_deposit',
        },
        {
          label: 'Đã cọc',
          value: 'deposited',
        },
        {
          label: 'Đang đặt hàng',
          value: 'ordering',
        },
        {
          label: 'Đã đặt hàng',
          value: 'ordered',
        },
        {
          label: 'Shop gửi hàng',
          value: 'shop_shipping',
        },
        {
          label: 'Kho Trung Quốc nhận',
          value: 'china_warehouse_received',
        },
        {
          label: 'Kho Việt Nam nhận',
          value: 'vietnam_warehouse_received',
        },
        {
          label: 'Chờ xuất kho',
          value: 'waiting_export',
        },
        {
          label: 'Đã xuất kho',
          value: 'exported',
        },
        {
          label: 'Đã hủy',
          value: 'cancelled',
        },
        {
          label: 'Tất cả trạng thái',
          value: 'all',
        },
      ];
      const rangePresets = [
        {
          label: 'Last 7 Days',
          value: [dayjs().add(-7, 'd'), dayjs()],
        },
        {
          label: 'Last 14 Days',
          value: [dayjs().add(-14, 'd'), dayjs()],
        },
        {
          label: 'Last 30 Days',
          value: [dayjs().add(-30, 'd'), dayjs()],
        },
        {
          label: 'Last 90 Days',
          value: [dayjs().add(-90, 'd'), dayjs()],
        },
      ];

      const handleFilter = (values) => {
        setQuery({
          status: values.status,
          dateRange: [ values.dateRange[0].format('YYYY-MM-DD 00:00:00'), values.dateRange[1].format('YYYY-MM-DD 23:59:59') ],
          search: values.search,
        });
        setPage(1);
      };
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const query = { customer_id: customer_id }
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
            title: <Link to="/customers-list">Danh sách khách hàng</Link>,
          },
          {
            title: customer_id,
          },
          {
            title: 'Lịch sử giao dịch',
          }
        ]}
      />
      <Divider />
      <Form
        layout="inline"
        onFinish={handleFilter}
        style={{ marginBottom: '16px' }}
        initialValues={filter}
      >
        <Form.Item label="Trạng thái" name="status">
          <Select
            options={options}
            style={{
              width: '200px',
            }}
          />
        </Form.Item>
        <Form.Item label="Thời gian" name="dateRange">
          <RangePicker
            allowClear={false}
            presets={rangePresets} />
        </Form.Item>
        <Form.Item label="Từ khóa" name="search">
          <Input placeholder="Nhập từ khóa" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Lọc
          </Button>
        </Form.Item>
      </Form>
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
        loading={loading}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
      />
    </div>
  )
}

export default Transactions