import { complaintApi } from '@api/complaintApi';
import statusTagMapping from '@components/components/tag';
import { AppResource } from '@generals/constants/AppResource';
import { Breadcrumb, Image, DatePicker, Button, Divider, Flex, notification, Select, Space, Table, Form, Input, Modal } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs';
import { AuthContext } from '@generals/contexts/authcontext';
import TextArea from 'antd/es/input/TextArea';
import NoteColumn from '../components/NoteColumn';

const { RangePicker } = DatePicker;

function Complaints() {
  const navigate = useNavigate()
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);
  const { auth } = useContext(AuthContext);

  const [filter, setFilter] = useState({
    status: 'all',
    dateRange: [dayjs().add(-30, 'd'), dayjs()],
    search: '',
  });
  const [query, setQuery] = useState({});
  const options = [
    {
      label: 'Chờ xử lý',
      value: 'pending',
    },
    {
      label: 'Đang xử lý',
      value: 'processing',
    },
    {
      label: 'Hoàn thành',
      value: 'completed',
    },
    {
      label: 'Đã hủy',
      value: 'cancelled',
    },
    {
      label: 'Tất cả trạng thái',
      value: 'all',
    }
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
      status: values.status,
      dateRange: [values.dateRange[0].format('YYYY-MM-DD 00:00:00'), values.dateRange[1].format('YYYY-MM-DD 23:59:59')],
      search: values.search,
    });
    setPage(1);
  };
  useEffect(() => {
    const fetchComplaints = async () => {
      const response = await complaintApi.getAllComplaints(query, page, pageSize);
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
    setLoading(true);
    fetchComplaints();
    setLoading(false);
  }, [page, pageSize, query]);

  const handleConfirm = async (record) => {
    const response = await complaintApi.confirmProcess(record.id);
    if (response.status === 200) {
      notification.success({
        message: 'Cập nhật thành công',
        description: response?.RM || '',
      });
      setTimeout(() => {
        navigate(0);
      }, 1000);
    } else {
      notification.error({
        message: 'Cập nhật thất bại',
        description: response?.RM || '',
      });
    }
  };

  const handleUpdate = async (id, data) => {
    const response = await complaintApi.updateComplaint(id, data );
    if (response.status === 200) {
      notification.success({
        message: 'Cập nhật thành công',
        description: response?.RM || '',
      });

    } else {
        notification.error({
          message: 'Cập nhật thất bại',
          description: response?.RM || '',
        });
      }
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
      title: 'Khách hàng',
      render: (_, record) => {
        return (
          <Space direction="vertical">
            <p>{record?.customer?.id}</p>
            <p>{record?.customer?.name}</p>
          </Space>
        );
      },
      width: '10%',
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
      title: 'Nhân viên xử lý',
      dataIndex: 'employee',
      render: (employee) => employee?.name,
      width: '10%',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      render: (_, record) => (
        <NoteColumn
          record={record}
          onUpdate={(id, data) => {
            handleUpdate(id, data);
          }}
        />
      )
    },
     
    {
      title: 'Loại khiếu nại',
      dataIndex: 'type',
      width: '10%',
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
        const processing = record.status === 'processing';
        return (
          <>
            {visible && (
              <Button type='primary' onClick={() => {
                Modal.confirm({
                  title: `Xác nhân xử lý khiếu nại về đơn hàng ${record.order_id || record.consignment_id}`,
                  content: 'Thao tác này không thể hoàn tác',
                  okText: 'Xác nhận',
                  cancelText: 'Đóng',
                  footer: (_, { OkBtn, CancelBtn }) => (
                    <>
                      <CancelBtn />
                      <OkBtn />
                    </>
                  ),
                  onOk: () => handleConfirm(record),
                });
              }}>
                Xác nhận
              </Button>
            )}

            {processing && (
              <Button type='primary' onClick={() => {
                Modal.confirm({
                  title: `Xác nhân xử lý xong khiếu nại về đơn hàng ${record.order_id || record.consignment_id}`,
                  content: 'Thao tác này không thể hoàn tác',
                  okText: 'Xác nhận',
                  cancelText: 'Đóng',
                  footer: (_, { OkBtn, CancelBtn }) => (
                    <>
                      <CancelBtn />
                      <OkBtn />
                    </>
                  ),
                  onOk: () => handleUpdate(record.id, {status: 'completed'}),
                });
              }}>
                Hoàn thành
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

      <Form
        layout="inline"
        onFinish={handleFilter}
        style={{ marginBottom: '16px' }}
        initialValues={filter}
      >
        <Form.Item label="Trạng thái" name="status">
          <Select
            options={options}
            style={{
              width: '200px',
            }}
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
      <Table
        columns={columns}
        dataSource={complaints}
        bordered
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);
          },
        }}
        loading={loading}
      />
    </div>
  )
}

export default Complaints