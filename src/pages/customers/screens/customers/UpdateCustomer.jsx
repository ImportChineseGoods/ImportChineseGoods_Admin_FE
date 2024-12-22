import { customerApi } from '@api/customerApi';
import { employeeApi } from '@api/employeeApi';
import formatDate from '@helpers/formatDate';
import { formatUnit } from '@helpers/formatUnit';
import { Breadcrumb, Button, Divider, Flex, Form, InputNumber, notification, Select, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

const { Text } = Typography;

function UpdateCustomer() {
  const { customer_id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({});
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);
  const [sales, setSales] = useState([]);

  const fetchCustomer = async () => {
    const response = await customerApi.getCustomerById(customer_id);
    if (response.status === 200) {
      setCustomer(response.customer);
      setLocked(response.customer.is_active === false);
    } else {
      notification.error({
        message: 'Lỗi khi lấy dữ liệu',
        description: response?.RM || 'Vui lòng thử lại.',
      });
    }
  };

  const fetchSales = async () => {
    const response = await employeeApi.getAllEmployee();
    if (response.status === 200) {
      setSales(response.employees.rows);
    } else {
      notification.error({
        message: 'Lỗi khi lấy dữ liệu',
        description: response?.RM || 'Vui lòng thử lại.',
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCustomer();
    fetchSales();
    setLoading(false);
  }, [customer_id]);

  const setFormValues = () => {
    form.setFieldsValue({
      sales_id: customer.sales_id,
      purchase_discount: customer.purchase_discount,
      shipping_discount: customer.shipping_discount,
      deposit_rate: customer.deposit_rate,
      note: customer.note,
    });
  }

  const handleReset = () => {
    setFormValues();
  };

  const options = sales.map((sale) => ({ label: sale.username, value: sale.id }));

  const handleUpdate = async (values) => {
    const response = await customerApi.updateCustomer(customer_id, values);
    if (response.status === 200) {
      notification.success({
        message: 'Cập nhật thông tin khách hàng thành công',
      });
      setTimeout(() => {
        navigate(0); // Reload trang
      }, 1000);
    } else {
      notification.error({
        message: 'Cập nhật thông tin khách hàng thất bại',
        description: response?.RM || 'Vui lòng thử lại.',
      });
    }

  };
  useEffect(() => {
    setFormValues();
  }, [customer, form]);
  return (
    <div>
      <Breadcrumb
        items={[
          {
            title: <Link to="/">Trang chủ</Link>,
          },
          {
            title: <Link to="/customers-list">Danh sách khách hàng</Link>,
          },
          {
            title: customer_id,
          },
          {
            title: 'Cập nhật thông tin khách hàng',
          }
        ]}
      />
      <Divider />
      <Flex justify='space-between' gap="60px">
        <Flex className="detailBox" vertical>
          <h3 style={{ textAlign: 'center' }}>Thông tin khách hàng</h3>
          <Flex gap="5px" vertical>
            <Text className="two-column">Tên khách hàng: <Text>{customer.name}</Text></Text>
            <Text className="two-column">Mã khách hàng: <Text></Text> {customer.id}</Text>
            <Text className="two-column">Email: <Text></Text> {customer.email}</Text>
            <Text className="two-column">Địa chỉ: <Text></Text> {customer.address}</Text>
            <Text className="two-column">Số điện thoại: <Text></Text> {customer.phone}</Text>
            <Text className="two-column">Ngày tạo:  <Text></Text>{formatDate(customer.create_at)}</Text>
            <Text className="two-column">Ngày cập nhật:  <Text></Text>{formatDate(customer.update_at)}</Text>
            <Text className="two-column">Nhân viên phụ trách: <Text></Text> {customer.sales?.name}</Text>
            <Text className="two-column">Trạng thái: <Text></Text> {customer.is_active ? 'Hoạt động' : 'Khóa'}</Text>
            <Text className="two-column">Tiền tích lũy: <Text></Text> {formatUnit.moneyVN(customer.accumulation)}</Text>
          </Flex>
        </Flex>

        <Flex className="detailBox" vertical>
          <h3 style={{ textAlign: 'center' }}>Cập nhật thông tin khách hàng</h3>
          <Form
            form={form}
            style={{ width: '100%' }}
            onFinish={handleUpdate}
            disabled={locked}
          >
            <Form.Item
              label="Nhân viên phụ trách"
              name="sales_id"
            >
              <Select
                showSearch
                placeholder="Chọn nhân viên phụ trách"
                style={{ width: '100%' }}
                options={options}
                optionFilterProp="label"
              />
            </Form.Item>
            <Form.Item
              label="Chiết khấu mua hàng"
              name="purchase_discount"
              rules={[{ required: true, message: 'Vui lòng nhập chiết khấu mua hàng' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                suffix="%"
                min={0}
                max={100}
              />
            </Form.Item>
            <Form.Item
              label="Chiết khấu vận chuyển"
              name="shipping_discount"
              rules={[{ required: true, message: 'Vui lòng nhập chiết khấu vận chuyển' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                suffix="%"
                min={0}
                max={100}
              />
            </Form.Item>
            <Form.Item
              label="Tỉ lệ đặt cọc"
              name="deposit_rate"
              rules={[{ required: true, message: 'Vui lòng nhập tỉ lệ đặt cọc' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                suffix="%"
                min={0}
                max={100}
              />
            </Form.Item>
            <Form.Item
              label="Ghi chú"
              name="note"
            >
              <TextArea
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item>
              <Flex justify="end" gap="10px">
                <Button type="primary" htmlType="submit" loading={loading}>
                  Cập nhật
                </Button>
                <Button type="default" onClick={handleReset}>
                  Đặt lại
                </Button>
              </Flex>
            </Form.Item>
          </Form>
        </Flex>
      </Flex>
    </div>
  )
}

export default UpdateCustomer