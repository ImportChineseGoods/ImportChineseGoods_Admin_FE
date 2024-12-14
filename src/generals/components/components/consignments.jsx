import React, { useEffect, useState } from 'react';
import { Table, Button, notification, Space } from 'antd';

import { useNavigate } from 'react-router-dom';
import { consignmentApi } from '@/api/consignmentApi';
import statusTagMapping from './tag';

const ConsignmentsList = ({ data, total, loading, page, pageSize, onPageChange }) => {
  const navigate = useNavigate();
  const [consignments, setConsignments] = useState( data ?
    data.map((consignment, index) => ({ ...consignment, key: index + 1 }) ) : []
  );
  useEffect(() => {
    setConsignments(
      data.map((consignment, index) => ({ ...consignment, key: index + 1 }))
    );
  }, [data]);

  const handleDelete = async (record) => {
    const consignmentToDelete = consignments.find((item) => item.key === record.key);

    const response = await consignmentApi.deleteConsignment(consignmentToDelete);
    if (response.status === 200) {
      notification.success({
        message: 'Xóa thành công',
        description: response?.RM || '',
      });
      const newConsignments = consignments.filter((item) => item.key !== record.key);
      setConsignments(newConsignments);
    } else {
      notification.error({
        message: 'Xóa thất bại',
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
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status) => {
        const StatusTag = statusTagMapping[status];
        return StatusTag ? <StatusTag /> : null;
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
              <Button color="danger" variant="filled" onClick={() => handleDelete(record)}>
                Xóa
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
