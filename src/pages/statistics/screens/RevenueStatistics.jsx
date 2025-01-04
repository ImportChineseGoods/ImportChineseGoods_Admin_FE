import { Breadcrumb, Divider, Flex, Form, Card, notification, DatePicker, Select, Space, Button, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import OrdersList from '../components/OrderList';
import { employeeApi } from '@api/employeeApi';
import { statisticsApi } from '@api/statisticApi';
import { formatUnit } from '@helpers/formatUnit';

const { RangePicker } = DatePicker;
const { Text } = Typography;

function RevenueStatistics() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState({});
  const [optionEmployees, setOptionEmployees] = useState([]);
  const [filter, setFilter] = useState({
    type: 'all',
    dateRange: [dayjs().add(-30, 'd'), dayjs()],
    employee: 'all',
  });
  const [query, setQuery] = useState({
    type: 'all',
    dateRange: [
      dayjs().add(-30, 'd').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    ],
    employee: 'all',
  });

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
      type: values.type,
      dateRange: [values.dateRange[0].format('YYYY-MM-DD 00:00:00'), values.dateRange[1].format('YYYY-MM-DD 23:59:59')],
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
    const response = await statisticsApi.revenue(query, page, pageSize);
    if (response.status === 200) {
      setData(response.statistics);
      setTotal(response.statistics.count);
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

  const fetchOrders = async () => {
    setLoading(true);
    const response = await statisticsApi.order(query, page, pageSize);
    if (response.status === 200) {
      setOrders(response.data);
    } else {
      notification.error({
        message: 'Lỗi khi lấy dữ liệu',
        description: response?.RM || 'Vui lòng thử lại.',
      });
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchOrders();
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
            title: 'Thống kê doanh thu',
          },
        ]}
      />
      <Divider />
      <Flex justify='space-between' style={{ margin: '10px' }}>
        <Form
          onFinish={handleFilter}
          style={{ display: 'flex', flexDirection: 'column' }}
          initialValues={filter}
        >
          <Form.Item label="Phân loại" name="type" style={{ marginBottom: '10px' }}>
            <Select
              options={optionOrders}
              style={{
                width: '200px',
              }}
            />
          </Form.Item>

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
          <Form.Item label="Thời gian" name="dateRange" style={{ marginBottom: '10px' }}>
            <RangePicker
              allowClear={false}
              presets={rangePresets} />
          </Form.Item>

          <Form.Item style={{ marginBottom: '10px' }}>
            <Button type="primary" htmlType="submit" style={{ width: '100px' }}>
              Lọc
            </Button>
          </Form.Item>
        </Form>
        <Card loading={loading} style={{ width: '500px' }}>
          <Flex vertical>
            <div className="two-column">
              <Text strong>Số đơn hàng: </Text>
              {data.count}
            </div>
            <div className="two-column">
              <Text strong>Doanh thu: </Text>
              {formatUnit.moneyVN(data.totalRevenue)}
            </div>
            <div className="two-column">
              <Text strong>Tổng tiền hàng: </Text>
              ({formatUnit.moneyTQ(data.totalCommodityMoneyTQ)}) {formatUnit.moneyVN(data.totalCommodityMoneyVN)}
            </div>
            <div className="two-column">
              <Text strong>Tổng tiền vận chuyển: </Text>
              {formatUnit.moneyVN(data.totalShippingFee)}
            </div>
          </Flex>
        </Card>
      </Flex>
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
      <OrdersList
        data={orders}
        total={total}
        loading={loading}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
      />
    </div >
  )
}

export default RevenueStatistics