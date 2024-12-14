import { getData } from '@api/getDataApi';
import { transactionApi } from '@api/transactionApi';
import { bankOption } from '@generals/constants/bankOption';
import { formatUnit } from '@helpers/formatUnit';
import { Breadcrumb, Button, Divider, Typography, Flex, Form, Input, InputNumber, notification, Select, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { use } from 'react';
import { Link } from 'react-router-dom'
import TransactionHistory from './components/TransactionHistory';

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

function Withdraws() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState('');
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getData.orderDepositData();
      if (res.status === 200) {
        setBalance(res.customer.balance);
      }
    }
    fetchBalance()
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const query = {
        type: ['withdraw'],
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
    fetchTransactions();
  }, [balance]);

  const handleSubmit = async (values) => {
    if (values.value > balance) notification.error({ message: 'Số dư không đủ!' });
    else {
      const res = await transactionApi.withdraw(values);
      if (res.status === 200) {
        setBalance(res.transaction.balance_after);
        notification.success({
          message: 'Rút tiền thành công!',
          description: res.RM || 'Yêu cầu rút tiền của bạn đã được gửi đi, vui lòng chờ xác nhận!',
        });
        form.resetFields();
      } else {
        notification.error({
          message: 'Rút tiền thất bại!',
          description: res.RM || 'Có lỗi xảy ra, vui lòng thử lại sau!',
        });
      }
    }
    setLoading(false);
  };

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
              label="Ngân hàng"
              name="bank"
              rules={[{ required: true, message: 'Hãy chọn ngân hàng!' }]}
            >
              <Select
                showSearch
                placeholder="Chọn ngân hàng"
                optionFilterProp="label"
                options={bankOption}
              />
            </Form.Item>

            <Form.Item
              label="Số tài khoản"
              name="bank_account"
              rules={[
                { required: true, message: 'Hãy nhập số tài khoản!' },
                {
                  pattern: /^[0-9]{6,20}$/,
                  message: 'Số tài khoản phải là số, từ 6 đến 20 chữ số!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Tên chủ sở hữu"
              name="bank_owner"
              rules={[
                { required: true, message: 'Hãy điền tên chủ sở hữu!' },
                {
                  pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
                  message: 'Tên chỉ được chứa chữ cái và khoảng trắng!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Số tiền"
              name="value"
              rules={[{ required: true, message: 'Hãy nhập số tiền muốn rút!' }, { type: 'integer', min: 1, message: 'Số tiền cần rút là số nguyên lớn hơn 0!' }]}
            >
              <InputNumber style={{ width: '100%' }} suffix="VNĐ" />
            </Form.Item>

            <Form.Item
              label="Ghi chú"
              name="note"
              rules={[
                {
                  max: 200,
                  message: 'Ghi chú không được vượt quá 200 ký tự!',
                },
              ]}
            >
              <Input />
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
          <div>
            <p>Số dư hiện tại: {formatUnit.moneyVN(balance)}</p>
            <Text type="danger">Tiền sẽ được chuyển về tài khoản trong vòng 24h</Text>
          </div>

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

export default Withdraws