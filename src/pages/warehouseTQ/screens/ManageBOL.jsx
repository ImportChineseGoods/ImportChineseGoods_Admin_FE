import { bolApi } from '@api/bolApi';
import { Breadcrumb, Divider, Flex, Form, Input, notification, DatePicker, Select, Space, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import WarehouseBOL from '@components/components/WarehouseBOL';
import { adminData } from '@api/adminDataApi';

const { RangePicker } = DatePicker;

function BOLs() {
  const [bols, setBOLs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);
  const [options, setOptions] = useState([]);
  const [filter, setFilter] = useState({
    dateRange: [dayjs().add(-30, 'd'), dayjs()],
    search: '',
    customer: '',
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
      status: values.status,
      dateRange: [
        values.dateRange[0].format('YYYY-MM-DD 00:00:00'),
        values.dateRange[1].format('YYYY-MM-DD 23:59:59')
      ],
      search: values.search,
      customer: values.customer,
    });
    setPage(1);
  };

  const handleSearchCustomer = async (value) => {
    const response = await adminData.getCustomer({ search: value });
    console.log(response);
    if (response.status === 200) {
      const customerOptions = response.data.map((item) => ({
        label: `${item.id} - ${item.name}`,
        value: item.id,
      }));
      setOptions(customerOptions);
    } else {
      notification.error({
        message: 'Lỗi khi tìm kiếm khách hàng',
        description: response?.RM || 'Không tìm thấy khách hàng',
      });
    }
  };


  const fetchBOLs = async () => {
    setLoading(true);
    const response = await bolApi.queryBOL(query, page, pageSize);
    if (response.status === 200) {
      setBOLs(response.bols.rows);
      setTotal(response.bols.count);
    } else {
      notification.error({
        message: 'Lỗi khi lấy dữ liệu',
        description: response?.RM || 'Vui lòng thử lại.',
      });
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchBOLs();
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
            title: 'Đơn đặt hàng',
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
        <Form.Item label="Khách hàng" name="customer">
          <Select
            showSearch
            placeholder="Tìm kiếm khách hàng"
            filterOption={false}
            onSearch={handleSearchCustomer}
            onChange={(value) => setFilter({ ...filter, customer: value })}
            options={options}
            allowClear
            style={{ width: 300 }}
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
      <WarehouseBOL
        data={bols}
        total={total}
        loading={loading}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
      />
    </div>
  );
}

export default BOLs;
