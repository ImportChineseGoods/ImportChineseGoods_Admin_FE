

import { bolApi } from '@api/bolApi';
import AddBOList from '@components/components/AddBOLList';
import { Breadcrumb, Button, Divider, Flex, Form, Input, InputNumber, notification } from 'antd';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';

function AddBOL() {
  const [form] = Form.useForm();
  const [bols, setBOLs] = useState([]);
  
  const onFinish = async (values) => {
    const response = await bolApi.updateBOL({
      ...values,
      status: 'vietnam_warehouse_received',
    });

    if (response?.status === 200) {
      notification.success({
        message: response?.RM || 'Bắn mã vận đơn thành công',
      });
      const newBOL = {
        ...response.bol,
      };

      setBOLs((prevConsignments) => {
        const index = prevConsignments.findIndex(bol => bol.bol_code === newBOL.bol_code);
        if (index !== -1) {
          const updatedConsignments = [...prevConsignments];
          updatedConsignments[index] = newBOL;
          return updatedConsignments;
        }

        return [newBOL, ...prevConsignments];
      });
      form.resetFields();
    } else {
      notification.error({
        message: 'Bắn mã vận đơn thất bại',
        description: response?.RM || 'Vui lòng thử lại.',
      });
    }
  };

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
            title: 'Bắn mã vận đơn',
          },
        ]}
      />
      <Divider style={{ margin: '30px 0' }}>Bắn mã vận đơn</Divider>
      <Form
        form={form}
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        onFinish={onFinish}
      >
        <Flex justify="space-around" align="center">
          <Flex vertical>
            <Form.Item
              style={{ marginBottom: '5px' }}
              label="Mã vận đơn"
              name="bol_code"
              rules={[
                {
                  required: true,
                  message: 'Hãy điền mã vận đơn!',
                },
              ]}
            >
              <Input style={{ width: '500px' }} />
            </Form.Item>

            <Form.Item
              style={{ marginBottom: 0 }}
              label="Cân nặng"
              name="weight"
            >
              <InputNumber
                style={{ width: '500px' }} />
            </Form.Item>
          </Flex>

          <Flex align="center" justify="center">
            <Form.Item style={{ marginBottom: 0 }}>
              <Button size="large" type="primary" htmlType="submit">
                Hoàn thành
              </Button>
            </Form.Item>
          </Flex>
        </Flex>
      </Form>

      <Divider style={{ margin: '30px 0' }}>Danh sách mã vận đơn</Divider>
      <AddBOList data={bols} />
    </div>
  );
}

export default AddBOL