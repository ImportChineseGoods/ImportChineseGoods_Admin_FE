import { customerApi } from '@api/customerApi';
import { Button, Form, Input, notification } from 'antd'
import React from 'react'

function ChangePassword() {
  const [form] = Form.useForm();  

  const handleSubmit = async (values) => {
    const res = await customerApi.changePassword(values);
    if (res.status === 200) {
      notification.success({
        message: 'Đổi mật khẩu thành công!',
        description: res?.RM ?? 'Mật khẩu của bạn đã được cập nhật.',
      });
      form.resetFields();
    } else {
      notification.error({
        message: 'Đổi mật khẩu thất bại!',
        description: res?.RM ?? 'Đã xảy ra lỗi khi đổi mật khẩu.',
      });
    }
  }
  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      onFinish={handleSubmit}
      autoComplete="off"
    >
      <Form.Item
        label="Mật khẩu hiện tại"
        name="oldPassword"
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
      >
        <Input.Password autoComplete='true'/>
      </Form.Item>

      <Form.Item
        label="Mật khẩu mới"
        name="newPassword"
        rules={[
          { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
          { min: 6, max: 20, message: 'Mật khẩu phải có từ 6-20 ký tự!' },
        ]}
      >
        <Input.Password autoComplete='true' />
      </Form.Item>

      <Form.Item
        label="Mật khẩu mới"
        name="acceptNewPassword"
        rules={[
          {
            required: true,
            message: 'Nhập lại mật khẩu mới!',
          },
          {
            validator: async (_, value) => {
              if (!value || value === form.getFieldValue('newPassword')) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Mật khẩu không khớp!'));
            }
          }
        ]}
      >
        <Input.Password autoComplete='true' />
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Đổi mật khẩu
        </Button>
      </Form.Item>
    </Form>
  )
}

export default ChangePassword