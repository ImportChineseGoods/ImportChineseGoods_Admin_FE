import { Breadcrumb, Divider, Flex, Form, Card, notification, DatePicker, Select, Space, Button, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import OrdersList from '../components/OrderList';
import { employeeApi } from '@api/employeeApi';
import { statisticsApi } from '@api/statisticApi';
import { formatUnit } from '@helpers/formatUnit';
import CustomerList from '../components/CustomerList';

const { RangePicker } = DatePicker;
const { Text } = Typography;

function DebtStatistics() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [optionEmployees, setOptionEmployees] = useState([]);
  const [filter, setFilter] = useState({
    employee: 'all',
  });
  const [query, setQuery] = useState(filter);

  const optionOrders = [
    {
      label: 'Đơn đặt hàng hộ',
      value: 'order',
    },
    {
      label: 'Đơn ký gửi',
      value: 'consignment',
    },
    {
      label: 'Tất cả đơn hàng',
      value: 'all',
    },
  ];

  const handleFilter = (values) => {
    setQuery({
      employee: values.employee,
    });
    setPage(1);
  };

  const handleSearchEmployees = async (value) => {
    const response = await employeeApi.searchEmployee({ search: value }, 1, 10);
    if (response.status === 200) {
      const employees = response.employees.rows.map((employee) => ({
        label: employee.name,
        value: employee.id,
      }));

      setOptionEmployees([
        {
          label: 'Tất cả nhân viên',
          value: 'all',
        },
        ...employees,
      ]);
    } else {
      notification.error({
        message: 'Lỗi khi lấy dữ liệu',
        description: response?.RM || 'Vui lòng thử lại.',
      });
    }
  };

  const fetchStatistics = async () => {
    setLoading(true);
    const response = await statisticsApi.debt(query, page, pageSize);
    if (response.status === 200) {
      setData(response.customers.rows);
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
    fetchStatistics();
  }, [query]);

  useEffect(() => {
    handleSearchEmployees('');
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
            title: 'Thống kê công nợ',
          },
        ]}
      />
      <Divider />
        <Form
          onFinish={handleFilter}
          layout='inline'
          initialValues={filter}
        >
          <Form.Item label="Nhân viên" name="employee" style={{ marginBottom: '10px' }}>
            <Select
              showSearch
              placeholder="Tìm kiếm nhân viên"
              filterOption={false}
              onSearch={handleSearchEmployees}
              onChange={(value) => setFilter({ ...filter, customer: value })}
              options={optionEmployees}
              allowClear
              style={{ width: 200 }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '10px' }}>
            <Button type="primary" htmlType="submit" style={{ width: '100px' }}>
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
      <CustomerList
        data={data}
        total={total}
        loading={loading}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
      />
    </div >
  )
}

export default DebtStatistics