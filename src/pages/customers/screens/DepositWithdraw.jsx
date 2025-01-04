import { adminData } from '@api/adminDataApi';
import { transactionApi } from '@api/transactionApi';
import { bankOption } from '@generals/constants/bankOption';
import { formatUnit } from '@helpers/formatUnit';
import { Breadcrumb, Button, Divider, Typography, Flex, Form, Input, InputNumber, notification, Select, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { use } from 'react';
import { Link } from 'react-router-dom'
import TransactionHistory from '../components/TransactionHistory';
import TextArea from 'antd/es/input/TextArea';

const { Text } = Typography;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

function DepositWithdraw() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState('');
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [options, setOptions] = useState([]);

  // const fetchCustomers = async () => {
  //   const res = await adminData.getAllCustomer();
  //   if (res.status === 200) {
  //     setCustomers(res.data);
  //   } else {
  //     notification.error({
  //       message: 'Lỗi khi lấy dữ liệu',
  //       description: res.RM || 'Vui lòng thử lại.',
  //     });
  //   }
  // }

  const fetchTransactions = async () => {
    setLoading(true);
    const query = {

    }
    const res = await transactionApi.queryTransaction(query, page, pageSize);
    if (res.status === 200) {
      setTransactions(res.transactions.rows);
      setTotal(res.transactions.count);
    } else {
      notification.error({
        message: 'Lỗi khi lấy dữ liệu',
        description: res.RM || 'Vui lòng thử lại.',
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchTransactions();
    setLoading(false);
  }, [page, pageSize]);

  useEffect(() => {
    setOptions(customers.map((customer) => ({
      value: customer.id,
      label: `${customer.id} - ${customer.name}`,
    })))
  }, [customers]);

  const handleSubmit = async (values) => {
    setLoading(true);
    const res = await transactionApi.createTransaction(values);
    if (res.status === 200) {
      notification.success({
        message: 'Giao dịch thành công',
        description: res.RM || '',
      });
      fetchTransactions();
    } else {
      notification.error({
        message: 'Giao dịch thất bại',
        description: res.RM || 'Vui lòng thử lại.',
      });
    }
    setLoading(false);
  };

   const handleSearchCustomer = async (value) => {
      const response = await adminData.getCustomer({ search: value });
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
  

  const handlePageChange = (newPage, newPageSize) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setPage(1)
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
            title: 'Rút tiền',
          },
        ]}
      />
      <Divider></Divider>
      <Flex gap='50px'>
        <Flex vertical className='detailBox' style={{ width: '50%' }}>
          <Form
            {...formItemLayout}
            form={form}
            onFinish={handleSubmit}
          >
            <Form.Item
              label="Khách hàng"
              name="customer_id"
              rules={[{ required: true, message: 'Hãy chọn khách hàng!' }]}
            >
              <Select
                showSearch
                placeholder="Tìm kiếm khách hàng"
                filterOption={false}
                onSearch={handleSearchCustomer}
                options={options}
              />
            </Form.Item>

            <Form.Item
              label="Loại giao dịch"
              name="type"
              rules={[{ required: true, message: 'Hãy chọn loại giao dịch!' }]}
            >
              <Select
                placeholder="Chọn loại giao dịch"
                options={[
                  { value: 'deposit', label: 'Nạp tiền' },
                  { value: 'withdraw', label: 'Rút tiền' },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Số tiền"
              name="value"
              rules={[{ required: true, message: 'Hãy nhập số tiền muốn rút!' }, { type: 'integer', min: 1, message: 'Số tiền cần rút là số nguyên lớn hơn 0!' }]}
            >
              <InputNumber style={{ width: '100%' }} suffix="VNĐ" />
            </Form.Item>

            <Form.Item
              label="Nội dung"
              name="content"
              rules={[
                {
                  max: 200,
                  message: 'Nội dung không được vượt quá 200 ký tự!',
                },
              ]}
            >
              <TextArea />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 6,
                span: 20,
              }}
            >

              <Button type="primary" htmlType="submit" loading={loading}>
                Xác nhận
              </Button>

            </Form.Item>


          </Form>

        </Flex>
        <Flex vertical className='detailBox' style={{ width: '50%' }}>
          <Flex justify='space-between' align='center'>
            <p>Hiển thị từ {startResult} đến {endResult} trong tổng {total} kết quả</p>
            <div>
              Hiển thị:
              <Select
                defaultValue="10"
                style={{ width: 120 }}
                onChange={handlePageSizeChange}
                options={[
                  { value: '10', label: '10 / page' },
                  { value: '20', label: '20 / page' },
                  { value: '50', label: '50 / page' },
                ]}
              />
            </div>
          </Flex>
          <TransactionHistory
            data={transactions}
            total={total}
            loading={loading}
            page={page}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />

        </Flex>
      </Flex>

    </div>
  )
}

export default DepositWithdraw