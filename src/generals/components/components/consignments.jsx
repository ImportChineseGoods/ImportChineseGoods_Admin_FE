import React, { useEffect, useState } from 'react';
import { Table, Button, notification, Space, Flex, Typography, Popover, Popconfirm, Modal } from 'antd';
const { Text } = Typography;
import { useNavigate } from 'react-router-dom';
import { consignmentApi } from '@/api/consignmentApi';
import statusTagMapping from './tag';
import Histories from './Histories';
import formatDate from '@helpers/formatDate';
import { formatUnit } from '@helpers/formatUnit';

const ConsignmentsList = ({ data, total, loading, page, pageSize, onPageChange }) => {
  const navigate = useNavigate();
  const [consignments, setConsignments] = useState(data ?
    data.map((consignment, index) => ({ ...consignment, key: index + 1 })) : []
  );
  useEffect(() => {
    setConsignments(
      data.map((consignment, index) => ({ ...consignment, key: index + 1 }))
    );
  }, [data]);

  const handleCancel = async (record) => {
    const consignmentToCancel = consignments.find((item) => item.key === record.key);

    const response = await consignmentApi.cancelConsignment(consignmentToCancel);
    if (response.status === 200) {
      notification.success({
        message: 'Hủy thành công',
        description: response?.RM || '',
      });
      setConsignments((prevConsignments) =>
        prevConsignments.map((consignment) =>
          consignment.id === record.id ? { ...consignment, status: 'cancelled' } : consignment
        )
      );
    } else {
      notification.error({
        message: 'Hủy thất bại',
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
      title: 'Mã vận đơn',
      dataIndex: 'bol',
      render: (bol) => bol?.bol_code,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      width: '30%',
    },
    {
      title: 'Cân nặng (kg)',
      dataIndex: 'weight',
      render: (weight) => formatUnit.weight(weight),
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
      key: 'action',
      render: (_, record) => {
        const visible = record.status === 'shop_shipping';
        return (
          <Space size="middle">
            <Button color="primary" variant="filled" onClick={() => navigate(`/consignments/${record.id}`)}>
              Xem
            </Button>

            {visible && (
              <Button color="danger" variant="filled" onClick={() => {
                Modal.confirm({
                  title: `Xác nhân hủy đơn hàng ${record.id}`,
                  content: 'Thao tác này không thể hoàng tác. Bạn có chắc chắn muốn hủy đơn hàng này?',
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
      dataSource={consignments}
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

export default ConsignmentsList;
