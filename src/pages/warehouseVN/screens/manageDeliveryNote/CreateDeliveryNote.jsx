import { adminData } from '@api/adminDataApi'
import { Breadcrumb, Button, Card, Divider, Flex, Form, Typography, notification, Select, Table, Popover, Tag, Space, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import OrderList from '../../components/OrderList'
import DeliveryManage from '../../components/DeliveryManage'


function CreateDeliveryNote() {
  const [form] = Form.useForm()
  const [orders, setOrders] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [options, setOptions] = useState([])
  const [customer, setCustomer] = useState()

  const fetchCustomer = async (value) => {
    const response = await adminData.getCustomer({ search: value })
    if (response.status === 200) {
      const customerOptions = response.data.map((item) => ({
        label: `${item.id} - ${item.name}`,
        value: item.id,
      }))
      setOptions(customerOptions)
    } else {
      notification.error({
        message: 'Lỗi khi tìm kiếm khách hàng',
        description: response?.RM || 'Không tìm thấy khách hàng',
      })
    }
  }

  useEffect(() => {
    fetchCustomer('')
  }, [])

  const onFinish = async (values) => {
    setCustomer(values)
    const response = await adminData.getOrderByCustomer({
      ...values,
      status: 'vietnam_warehouse_received'
    });

    if (response?.status === 200) {
      setOrders(response.data.rows.map((item, index) => ({
        ...item,
        key: index + 1,
      })))
      if (response.data.rows.length === 0) {
        notification.info({
          message: 'Không tìm thấy đơn',
          description: 'Khách hàng này không có đơn hàng nào cần xuất kho.',
        });
      }
    } else {
      notification.error({
        message: 'Tìm đơn thất bại',
        description: response?.RM || 'Vui lòng thử lại.',
      });
    }
  };

  const resetPage = () => {
    form.resetFields();
    setOrders([]);
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setCustomer();
  }

  const changeOrder = () => {
    setOrders([])
    setSelectedRowKeys([])
    setSelectedRows([])
    setCustomer();
  }

  const createSuccess = () => {
    setOrders((prevData) => prevData.filter((order) => !selectedRowKeys.includes(order.id))) 
    setSelectedRowKeys([])
    setSelectedRows([]) 
  }

  return (
    <div>
      <Breadcrumb
        items={[
          {
            title: <Link to="/">Trang chủ</Link>,
          },
          {
            title: 'Kho Việt Nam'
          },
          {
            title: 'Tạo phiếu xuất kho',
          },
        ]}
      />
      <Divider style={{ margin: '30px 0' }}>Tạo phiếu xuất kho</Divider>

      <Flex gap='20px'>
        <Flex vertical style={{ width: '450px' }} gap="20px">
          <Flex vertical className="detailBox">
            <h3 style={{ textAlign: 'center' }}>Tìm đơn hàng</h3>
            <Form
              form={form}
              name="order"
              onFinish={onFinish}
            >
              <Flex vertical justify="space-between" >
                <Form.Item
                  label="Khách hàng"
                  name="customer"
                  rules={[{ required: true, message: 'Vui lòng chọn khách hàng' }]}
                >
                  <Select
                    showSearch
                    placeholder="Nhập mã KH"
                    filterOption={false}
                    onSearch={(value) => fetchCustomer(value)}
                    onChange={changeOrder}
                    options={options}
                    allowClear
                  />
                </Form.Item>

                <Form.Item
                  label="Loại đơn"
                  name="type"
                  rules={[{ required: true, message: 'Vui lòng chọn loại đơn' }]}
                >
                  <Select
                    placeholder="Chọn loại đơn"
                    options={[
                      { label: 'Đơn đặt hàng hộ', value: 'order' },
                      { label: 'Đơn ký gửi', value: 'consignment' },
                    ]}
                    onChange={changeOrder}
                  >
                  </Select>
                </Form.Item>
                <Flex gap='20px' justify='end'>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Tìm kiếm
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <Button type="default" htmlType="reset" onClick={resetPage} >
                      Reset
                    </Button>
                  </Form.Item>
                </Flex>
              </Flex>
            </Form>
          </Flex>
          <Flex vertical className="detailBox" >
            <h3 style={{ textAlign: 'center', width: '100%' }}>Thông tin phiếu xuất kho</h3>
            <DeliveryManage setData={createSuccess} customer={customer} selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
          </Flex>
        </Flex>
        <Card  style={{ width: '100%' }}>
          <OrderList data={orders} selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
        </Card>
      </Flex>

    </div>
  )
}

export default CreateDeliveryNote