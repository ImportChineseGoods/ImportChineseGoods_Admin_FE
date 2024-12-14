import React, { useEffect, useState } from 'react';
import { Table, Button, Typography, Image, Space, Flex, notification } from 'antd';
import statusTagMapping from '@components/components/tag';
import { useNavigate } from 'react-router-dom';
import { formatUnit } from '@helpers/formatUnit';
import { orderApi } from '@api/orderApi';
const { Text, Link } = Typography;

const OrdersList = ({ data, total, loading, page, pageSize, onPageChange }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(
    data.map((order, index) => ({ ...order, key: index + 1 }))
  );
  useEffect(() => {
    setOrders(
      data.map((order, index) => ({ ...order, key: index + 1 }))
    );
  }, [data]);

  const handleCancel = async (record) => {
    const response = await orderApi.cancelOrder(record.id);
    if (response.status === 200) {
      notification.success({
        message: 'Hủy đơn hàng thành công',
        description: response?.RM || '',
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === record.id ? { ...order, status: 'cancelled' } : order
        )
      );
    } else {
      notification.error({
        message: 'Hủy đơn hàng thất bại',
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
      title: 'Ảnh',
      dataIndex: 'products',
      render: (products) => {
        return <Image width={80} height={80} src={products[0]?.image_url} />
      },
      width: '100px'
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
    },
    {
      title: 'Thông tin tài chính',
      render: (_, record) => {
        const amount_paid = record.amount_paid === null ? formatUnit.moneyVN(0) : formatUnit.moneyVN(record.amount_paid);
        return (
          <Flex justify='space-between'>
            <Flex vertical>
              <p>Tổng đơn:</p>
              <Text type="success">Đã thanh toán:</Text>
              <Text type="danger">Còn nợ:</Text>
            </Flex>
            <Flex vertical justify='flex-end' style={{ textAlign: 'end' }}>
              <Text>{formatUnit.moneyVN(record.total_amount)}</Text>
              <Text type="success">{amount_paid}</Text>
              <Text type="danger">{formatUnit.moneyVN(record.outstanding_amount)}</Text>
            </Flex>
          </Flex>
        );
      }
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      // width: '30%',
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
        const visibleStatus = ['waiting_deposit', 'deposited']
        const visible = visibleStatus.includes(record.status);
        const isDeposited = record.status === 'waiting_deposit';
        return (
          <Flex vertical gap='middle'>
            <Space size="middle">
              <Button color="primary" variant="filled" onClick={() => navigate(`/orders/${record.id}`)}>
                Xem
              </Button>

              {visible && (
                <Button color="danger" variant="filled" onClick={() => handleCancel(record)}>
                  Hủy
                </Button>
              )}
            </Space>
            {isDeposited && <Button color="primary" variant="solid" onClick={() => navigate(`/orders/${record.id}/deposit`)}>
              Đặt cọc
            </Button>}
          </Flex>

        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={orders}
      bordered
      pagination={{
        current: page,
        pageSize: pageSize || 1000,
        total: total,
        onChange: (newPage, newPageSize) => onPageChange(newPage, newPageSize),
      }}
      loading={loading}
    />
  );
};

export default OrdersList;
