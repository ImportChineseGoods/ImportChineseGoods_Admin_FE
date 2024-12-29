import React, { useEffect, useState } from 'react';
import { Table, Button, Typography, Image, Space, Flex, notification, Popover, Modal } from 'antd';
import statusTagMapping from '@components/components/tag';
import { useNavigate } from 'react-router-dom';
import { formatUnit } from '@helpers/formatUnit';
import { deliveryApi } from '@api/deliverynoteApi';
import Histories from '@components/components/Histories';
import formatDate from '@helpers/formatDate';
const { Text, Link } = Typography;

const DeliveryList = ({ data, total, loading, page, pageSize, onPageChange }) => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState(
    data.map((delivery, index) => ({ ...delivery, key: index + 1 }))
  );
  useEffect(() => {
    setDeliveries(
      data.map((delivery, index) => ({ ...delivery, key: index + 1 }))
    );
  }, [data]);

  const handleCancel = async (record) => {
    const response = await deliveryApi.cancelDelivery(record.id);
    if (response.status === 200) {
      notification.success({
        message: 'Hủy phiếu xuất kho thành công',
        description: response?.RM || '',
      });
      setDeliveries((prevOrders) =>
        prevOrders.map((delivery) =>
          delivery.id === record.id ? { ...delivery, status: 'cancelled' } : delivery
        )
      );
    } else {
      notification.error({
        message: 'Hủy phiếu xuất kho thất bại',
        description: response?.RM || '',
      });
    }
  };

  const exportDelivery = async (record) => {
    const response = await deliveryApi.approveOrder(record.id);
    if (response.status === 200) {
      notification.success({
        message: 'Xuất kho thành công',
        description: response?.RM || '',
      });
      setDeliveries((prevOrders) =>
        prevOrders.map((delivery) =>
          delivery.id === record.id ? { ...delivery, status: 'deliveryed' } : delivery
        )
      );
    } else {
      notification.error({
        message: 'Xuất kho thất bại',
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
      title: 'Mã phiếu',
      dataIndex: 'id',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_at',
      render: (create_at) => formatDate(create_at),
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
      width: '20%',
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
      title: 'Cân nặng (kg)',
      dataIndex: 'total_weight',
      render: (total_weight) => formatUnit.weight(total_weight),
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
        const visible = record.status === 'waiting_export';
        return (
          <Space size="middle">
            <Button color="primary" variant="filled" onClick={() => navigate(`${record.id}`)}>
              Xem
            </Button>


            {visible && (
              <Button color="danger" variant="filled" onClick={() => {
                Modal.confirm({
                  title: `Xác nhân hủy phiếu xuất kho ${record.id}`,
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
          </Space>

        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={deliveries}
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

export default DeliveryList;
