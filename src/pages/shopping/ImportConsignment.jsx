import { Breadcrumb, Divider, Flex, Input, Button, Form, notification } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Consignments from '@components/components/consignments';
import { consignmentApi } from '@api/consignmentApi';

function ImportConsignment() {
  const [form] = Form.useForm();
  const [consignments, setConsignments] = useState([]);
  const onFinish = async (values) => {
    if (!values.bol) {
      notification.error({
        message: 'Không có mã vận đơn',
        description: 'Vui lòng nhập mã vận đơn trước khi hoàn thành.',
      });
      return;
    }

    const data = {
      warehouse_id: 1,
      note: values.note || '',
      bol_code: values.bol,
    };

    try {
      const response = await consignmentApi.createConsignment(data);

      if (response?.status === 200) {
        notification.success({
          message: 'Tạo đơn ký gửi thành công',
          description: response?.RM || 'Đơn ký gửi đã được tạo.',
        });
        const newConsignment = {
          ...response.consignment,
          bol_code: values.bol,
        };

        setConsignments((prevConsignments) => [
          ...prevConsignments,
          newConsignment,
        ]);
        form.resetFields();
      } else {
        notification.error({
          message: 'Tạo đơn ký gửi thất bại',
          description: response?.RM || 'Vui lòng thử lại.',
        });
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      notification.error({
        message: 'Đã xảy ra lỗi',
        description: error?.RM || 'Vui lòng thử lại sau.',
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
            title: 'Tạo đơn ký gửi',
          },
        ]}
      />
      <Divider style={{margin: '30px 0'}}>Bắn mã vận đơn</Divider>
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
              name="bol"
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
              label="Ghi chú"
              name="note"
            >
              <Input style={{ width: '500px' }} />
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

      <Divider style={{margin: '30px 0'}}>Danh sách đơn ký gửi</Divider>
      <Consignments data={consignments}></Consignments>
    </div>
  );
}

export default ImportConsignment;
