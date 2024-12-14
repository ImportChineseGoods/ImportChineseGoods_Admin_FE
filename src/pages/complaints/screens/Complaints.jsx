import { complaintApi } from '@api/complaintApi';
import statusTagMapping from '@components/components/tag';
import { AppResource } from '@generals/constants/AppResource';
import { Breadcrumb, Image, Button, Divider, Flex, notification, Select, Space, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Complaints() {
  const navigate = useNavigate()
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    const fetchComplaints = async () => {
      const response = await complaintApi.getAllComplaints(page, pageSize);
      if (response.status === 200) {
        setComplaints(response.complaints.rows.map((complaint, index) => ({ ...complaint, key: index + 1 })));
        setTotal(response.complaints.count);
      } else {
        notification.error({
          message: 'Lỗi khi lấy dữ liệu',
          description: response?.RM || 'Vui lòng thử lại.',
        });
      }
    }
    fetchComplaints();
  }, []);

  const onPageChange = (newPage, newPageSize) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleCancel = async (record) => {
    const complaintToDelete = complaints.find((item) => item.key === record.key);

    const response = await complaintApi.cancelComplaint(complaintToDelete);
    if (response.status === 200) {
      notification.success({
        message: 'Hủy thành công',
        description: response?.RM || '',
      });
      const updatedComplaints = complaints.map((item) =>
        item.key === record.key ? { ...item, status: 'cancelled' } : item
      );
  
      // Cập nhật state với danh sách mới
      setComplaints(updatedComplaints);
    } else {
      notification.error({
        message: 'Hủy thất bại',
        description: response?.RM || '',
      });
    }
  };


  const handlePageSizeChange = (value) => {
    setPageSize(value);
  };
  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      rowScope: 'row',
      width: '4%',
      render: (_, record) => {
        return (page - 1) * pageSize + record.key;
      },
    },
    {
      title: 'Ảnh',
      dataIndex: 'image_url',
      render: (image_url) => {
        return <Image width={80} height={80} src={image_url} />
      },
      width: '100px'
    },
    {
      title: 'Mã đơn hàng',
      render: (_, record) => record?.order_id || record?.consignment_id,
      width: '10%',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
    },
    {
      title: 'Loại khiếu nại',
      dataIndex: 'type',
      width: '15%',
      render: (type) => AppResource.complaintType[type],
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: '10%',
      render: (status) => {
        const StatusTag = statusTagMapping[status];
        return StatusTag ? <StatusTag /> : null;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '10%',
      render: (_, record) => {
        const visible = record.status === 'pending';
        return (
          <>
            {visible && (
              <Button color="danger" variant="filled" onClick={() => handleCancel(record)}>
                Hủy
              </Button>
            )}
          </>
        );
      },
    },
  ];

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
            title: 'Khiếu nại',
          },
        ]}
      />
      <Divider></Divider>
      <Button type='primary' onClick={() => navigate('new')}>
        Tạo khiếu nại
      </Button>


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
      <Table
        columns={columns}
        dataSource={complaints}
        bordered
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: (newPage, newPageSize) => onPageChange(newPage, newPageSize),
        }}
        loading={loading}
      />
    </div>
  )
}

export default Complaints