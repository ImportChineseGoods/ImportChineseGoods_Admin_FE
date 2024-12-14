import { orderApi } from '@api/orderApi';
import { Breadcrumb, Divider, Flex, notification, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OrdersList from '../components/OrderList';


function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const response = await orderApi.getAllOrder(page, pageSize);
      if (response.status === 200) {
        setOrders(response.orders.rows);
        setTotal(response.orders.count);
      } else {
        notification.error({
          message: 'Lỗi khi lấy dữ liệu',
          description: response?.RM || 'Vui lòng thử lại.',
        });
      }
      setLoading(false);
    };
    fetchOrders();
  }, [page, pageSize]);

  const handlePageChange = (newPage, newPageSize) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
  };

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
      <Flex justify='space-between' align='center' style={{ margin: '10px' }}>
        <p>Hiển thị từ {startResult} đến {endResult} trong tổng {total} kết quả</p>

        <div>
          Hiển thị:
          <Select
            defaultValue="50"
            style={{ width: 120 }}
            onChange={handlePageSizeChange}
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
        total={total}  // Truyền tổng số lượng phần tử
        loading={loading}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange} // Truyền hàm thay đổi trang
      />
    </div>
  );
}

export default Orders;
