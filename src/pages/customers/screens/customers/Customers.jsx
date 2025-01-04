import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import { customerApi } from '@api/customerApi';
import { Breadcrumb, Divider, Form, DatePicker, Button, Flex, Select, Input } from 'antd';
import { Link } from 'react-router-dom';
import CustomersList from '../../components/CustomerList';

const { RangePicker } = DatePicker;

function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState({
    dateRange: [dayjs().add(-30, 'd'), dayjs()],
    search: '',
  });

  const [query, setQuery] = useState({});

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
      dateRange: [values.dateRange[0].format('YYYY-MM-DD 00:00:00'), values.dateRange[1].format('YYYY-MM-DD 23:59:59')],
      search: values.search,
    });
    setPage(1);
  };

  const fetchCustomers = async () => {
    setLoading(true);
    const response = await customerApi.search(query, page, pageSize);
    if (response.status === 200) {
      setCustomers(response.customers.rows);
      setTotal(response.customers.count);
    } else {
      notification.error({
        message: 'Lỗi khi lấy dữ liệu',
        description: response?.RM || 'Vui lòng thử lại.',
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, pageSize, query]);

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
            title: 'Khách hàng',
          },
        ]}
      />
      <Divider />
      <Form
        layout="inline"
        onFinish={handleFilter}
        style={{ marginBottom: '16px' }}
        initialValues={filter}
      >
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
      <Flex justify='space-between' align='center' style={{ margin: '10px' }}>
        <p>Hiển thị từ {startResult} đến {endResult} trong tổng {total} kết quả</p>

        <div>
          Hiển thị:
          <Select
            defaultValue="50"
            style={{ width: 120 }}
            onChange={(value) => {
              setPageSize(value);
            }}
            options={[
              { value: '10', label: '10 / page' },
              { value: '20', label: '20 / page' },
              { value: '50', label: '50 / page' },
              { value: '100', label: '100 / page' },
            ]}
          />
        </div>
      </Flex>

      <CustomersList
        data = {customers}
        page = {page}
        pageSize = {pageSize}
        total = {total}
        loading = {loading}
        onPageChange = {setPage}
        />
    </div>
  )
}

export default Customers