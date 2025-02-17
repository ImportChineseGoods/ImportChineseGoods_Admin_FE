import React, { useEffect, useState } from 'react';
import { Table, Button, Typography, Image, Space, Flex, notification, Popover, Modal } from 'antd';
import statusTagMapping from '@components/components/tag';
import { useNavigate } from 'react-router-dom';
import { formatUnit } from '@helpers/formatUnit';
import { orderApi } from '@api/orderApi';
import Histories from '@components/components/Histories';
import formatDate from '@helpers/formatDate';
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

  const approveOrder = async (record) => {
    const response = await orderApi.approveOrder(record.id);
    if (response.status === 200) {
      notification.success({
        message: 'Duyệt đơn hàng thành công',
        description: response?.RM || '',
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === record.id ? { ...order, status: 'ordered' } : order
        )
      );
    } else {
      notification.error({
        message: 'Duyệt đơn hàng thất bại',
        description: response?.RM || '',
      });
    }
  }

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
      title: 'Khách hàng',
      dataIndex: 'customer',
      render: (customer) => {
        return (
          <Flex vertical>
            <Text>{customer.name}</Text>
            <Text>{customer.id}</Text>
          </Flex>
        );
      }
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
      render: (_, record) => {
        const StatusTag = statusTagMapping[record.status];
        return (
          <Flex vertical>
            {StatusTag ?
              <Popover
                content={<Histories data={record.histories} />}
                trigger="hover"
                placement="bottom">
                <Space><StatusTag /></Space>
              </Popover>
              : <Tag color="default">Không xác định</Tag>}
            <Text>{formatDate(record.update_at)}</Text>
          </Flex>
        )
      },
    },
    {
      title: 'Thao tác',
      width: '100px',
      key: 'action',
      render: (_, record) => {
        const visibleStatus = ['waiting_deposit', 'deposited']
        const visible = visibleStatus.includes(record.status);
        const isOrdering = record.status === 'ordering';
        return (
          <Space size="middle">
            <Button color="primary" variant="filled" onClick={() => navigate(`/orders/${record.id}`)}>
              Xem
            </Button>


            {visible && (
              <Button color="danger" variant="filled" onClick={() => {
                Modal.confirm({
                  title: `Xác nhân hủy đơn hàng ${record.id}`,
                  content: 'Thao tác này không thể hoàn tác. Bạn có chắc chắn muốn hủy đơn hàng này?',
                  okText: 'Xác nhận',
                  cancelText: 'Đóng',
                  footer: (_, { OkBtn, CancelBtn }) => (
                    <>
                      <CancelBtn />
                      <OkBtn />
                    </>
                  ),
                  onOk: () => handleCancel(record),
                });
              }}>
                Hủy
              </Button>
            )}
            {isOrdering && (
              <Button type='primary' onClick={() => {
                Modal.confirm({
                  title: `Xác nhân đặt hàng đơn ${record.id}`,
                  content: 'Thao tác này không thể hoàn tác.',
                  okText: 'Xác nhận',
                  cancelText: 'Đóng',
                  footer: (_, { OkBtn, CancelBtn }) => (
                    <>
                      <CancelBtn />
                      <OkBtn />
                    </>
                  ),
                  onOk: () => approveOrder(record),
                });
              }}>
                Duyệt
              </Button>
            )}
          </Space>

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
        onChange: (newPage, newPageSize) => onPageChange(newPage),
      }}
      loading={loading}
    />
  );
};

export default OrdersList;
