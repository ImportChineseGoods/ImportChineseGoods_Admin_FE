import { PlusOutlined } from '@ant-design/icons';
import { customerApi } from '@api/customerApi';
import uploadImageToCloudinary from '@generals/utils/uploadImage';
import { notification, Form, Input, Button, Upload, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react';

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

function Information() {
  const [form] = Form.useForm(); // Tạo đối tượng form
  const [information, setInformation] = useState({});
  const [loading, setLoading] = useState('');
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchInformation = async () => {
      const response = await customerApi.getCustomerInfo();
      if (response.status === 200) {
        const customerData = response.customer;
        setInformation(customerData);
        form.setFieldsValue(customerData);
      } else {
        notification.error({
          message: 'Lỗi khi lấy dữ liệu',
          description: response?.RM || 'Vui lòng thử lại.',
        });
      }
    };
    fetchInformation();
  }, [form]);

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  console.log(information);

  const handleSubmit = async (values) => {
    const formData = new FormData();
    setLoading('loading');

    if (fileList.length > 0) {
      console.log('fileList', fileList[0]); // Kiểm tra xem fileList có dữ liệu không
      try {
        const image = await uploadImageToCloudinary(fileList[0]);
        console.log('image', image); // Kiểm tra kết quả trả về
        if (image.url) {
          formData.append('image_url', image.url); // Đính kèm URL ảnh vào formData
        }
      } catch (error) {
        notification.error({
          message: 'Có lỗi khi upload ảnh!',
          description: error.message || "Đã xảy ra lỗi khi upload ảnh lên Cloudinary.",
        });
        setLoading(false); // Tắt loading nếu có lỗi
        return;
      }
    }

    // Gọi API tạo sản phẩm
    const res = await customerApi.editInfo({
      name: values.name,
      phone: values.phone,
      address: values.address,
      note: values.note,
      avatar: formData.get('image_url') || null,
    });
    if (res.status === 200) {
      notification.success({
        message: 'Cập nhật thông tin thành công',
        description: res?.RM ?? "",
      });

      setFileList([]);
      form.resetFields(information);
      setLoading('');

    } else {
      notification.error({
        message: 'Có lỗi xảy ra khi cập nhật thông tin!',
        description: res?.RM ?? "Đã xảy ra lỗi, vui lòng thử lại.",
      });

      setFileList([]);
      setLoading('');
    }
  };
  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      onFinish={handleSubmit}
    >
      <Form.Item label="Mã khách hàng" name="id">
        <Input disabled />
      </Form.Item>

      <Form.Item label="Họ và tên" name="name">
        <Input />
      </Form.Item>

      <Form.Item label="Số điện thoại" name="phone">
        <Input />
      </Form.Item>

      <Form.Item label="Email" name="email">
        <Input disabled />
      </Form.Item>

      <Form.Item label="Địa chỉ" name="address">
        <TextArea rows={2} />
      </Form.Item>

      <Form.Item label="CK phí mua hàng" name="purchase_discount">
        <Input suffix='%' disabled />
      </Form.Item>


      <Form.Item label="CK phí vận chuyển" name="shipping_discount">
        <Input suffix='%' disabled />
      </Form.Item>

      <Form.Item label="Tỉ lệ cọc" name="deposit_rate">
        <Input suffix='%' disabled />
      </Form.Item>


      <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
        <Upload
          listType="picture-card"
          beforeUpload={(file) => {
            setFileList([file]); // Lưu ảnh đã chọn vào fileList
            return false;  // Chặn việc upload trực tiếp ảnh ngay lập tức
          }}
          onRemove={() => setFileList([])} // Xử lý khi ảnh bị xóa
        >
          <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </button>
        </Upload>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Space>
          <Button type="primary" htmlType="submit">
            Lưu thay đổi
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default Information;
