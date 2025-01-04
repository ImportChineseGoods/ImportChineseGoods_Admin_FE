import React, { useEffect, useState } from 'react';
import { Table, Button, Typography, Image, Space, Flex, notification, Popover, Modal, Tag } from 'antd';
import statusTagMapping from '@components/components/tag';
import { useNavigate } from 'react-router-dom';
import { formatUnit } from '@helpers/formatUnit';
import { orderApi } from '@api/orderApi';
import formatDate from '@helpers/formatDate';
const { Text, Link } = Typography;

const OrdersList = ({ data, total, loading, page, pageSize, onPageChange }) => {
  const navigate = useNavigate();
  const [isProfit, setIsProfit] = useState(false);

  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname.endsWith('/profit')) {
      setIsProfit(true);
    } else {
      setIsProfit(false);
    }
  }, []); 
  const [orders, setOrders] = useState(
    data.map((order, index) => ({ ...order, key: index + 1 }))
  );
  useEffect(() => {
    setOrders(
      data.map((order, index) => ({ ...order, key: index + 1 }))
    );
  }, [data]);

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
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      render: (id) => {
        const handleRedirect = () => {
          if (id.startsWith('DH')) {
            navigate(`/orders/${id}`);
          } else if (id.startsWith('KG')) {
            navigate(`/consignments/${id}`);
          } else {
            navigate('/not-found');
          }
        };
        return <Link onClick={handleRedirect}>{id}</Link>;
      },
    },
    {
      title: 'Loại đơn',
      render: (_, record) => {
        return (
          <Text>{record.number_of_product ? 'Đơn đặt hàng' : 'Đơn ký gửi'}</Text>
        )
      }
    },
    {
      title: 'Khách hàng',  
      dataIndex: 'customer',
      render: (_, record) => {
        return (
          <Flex vertical>
            <Text>{record.customer_id}</Text>
            <Text>{record?.name || record.customer?.name}</Text>
          </Flex>
          
        )
      }
    },
    {
      title: 'Tiền hàng',
      dataIndex: 'commodity_money',
      render: (_, record) => record.commodity_money ?
      <Flex vertical>
        <Text>({formatUnit.moneyTQ(record.commodity_money)})</Text>
        {formatUnit.moneyVN(record.commodity_money * record.applicable_rate)} 
      </Flex>
      : '_',
    },
    {
      title: 'Phí vận chuyển',
      dataIndex: 'shipping_fee',
      render: (shipping_fee) => formatUnit.moneyVN(shipping_fee),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_amount',
      render: (total_amount) => formatUnit.moneyVN(total_amount),
    },
    isProfit && {
      title: 'Lợi nhuận',
      render: (_, record) => <Text type='success'>{formatUnit.moneyVN(record.total_amount - record.actual_payment_amount * record.original_rate - record.weight * record.original_weight_fee)}</Text>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_at',
      render: (create_at) => formatDate(create_at),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (_, record) => {
        const StatusTag = statusTagMapping[record.status];
        return (
          <Flex vertical>
            {StatusTag ?
              <Space><StatusTag /></Space>
              : <Tag color="default">Không xác định</Tag>}
            <Text>{formatDate(record.update_at)}</Text>
          </Flex>
        )
      },
    },
  ].filter(Boolean);

  return (
    <Table
      columns={columns}
      dataSource={orders}
      bordered
      pagination={{
        current: page,
        pageSize: pageSize || 1000,
        total: total,
        onChange: (newPage, newPageSize) => onPageChange(newPage),
      }}
      loading={loading}
    />
  );
};

export default OrdersList;
