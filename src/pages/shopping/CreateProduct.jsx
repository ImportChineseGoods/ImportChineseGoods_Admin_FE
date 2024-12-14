import React, { useState } from 'react';
import { Button, Input, InputNumber, Form, Upload, notification, Breadcrumb, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import uploadImageToCloudinary from '@generals/utils/uploadImage';
import { Link } from 'react-router-dom';
import { productApi } from '@api/productApi';

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


const CreateProduct = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState('');
  const [fileList, setFileList] = useState([]);

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  // Hàm gửi dữ liệu sản phẩm lên server
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
    const res = await productApi.createProduct({
      shop: values.shop,
      link: values.link,
      name: values.product,
      price: values.price,
      quantity: values.quantity,
      description: values.description,
      note: values.note,
      image_url: formData.get('image_url') || null,
    });
    if (res.status === 200) {
      notification.success({
        message: 'Tạo sản phẩm thành công',
        description: res?.RM ?? "Sản phẩm đã được tạo thành công!",
      });

      setFileList([]);
      form.resetFields();
      setLoading('');

    } else {
      notification.error({
        message: 'Có lỗi xảy ra khi tạo sản phẩm!',
        description: res?.RM ?? "Đã xảy ra lỗi, vui lòng thử lại.",
      });

      setFileList([]);
      setLoading('');
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
            title: 'Thêm sản phẩm',
          },
        ]}
        />
      <Divider></Divider>

      <Form
        {...formItemLayout}
        form={form}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Tên shop"
          name="shop"
          rules={[{ required: true, message: 'Hãy điền tên shop!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Link sản phẩm"
          name="link"
          rules={[{ required: true, message: 'Hãy điền link sản phẩm!' }, { type: 'url', warningOnly: true, message: 'Giá trị không hợp lệ!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Tên sản phẩm"
          name="product"
          rules={[{ required: true, message: 'Hãy điền tên sản phẩm!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Đơn giá"
          name="price"
          rules={[{ required: true, message: 'Hãy điền đơn giá sản phẩm!' }, { type: 'number', min: 0.01, message: 'Đơn giá phải là số lớn hơn 0!' }]}
        >
          <InputNumber style={{ width: '100%' }} prefix="￥" />
        </Form.Item>

        <Form.Item
          label="Số lượng"
          name="quantity"
          rules={[{ required: true, message: 'Hãy điền số lượng!' }, { type: 'integer', min: 1, message: 'Số lượng phải là số nguyên lớn hơn 0!' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Thuộc tính"
          name="description"
          rules={[{ required: true, message: 'Hãy điền thuộc tính sản phẩm!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Ghi chú" name="note">
          <Input />
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

        <Form.Item
          wrapperCol={{
            offset: 6,
            span: 20,
          }}
        >
          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm sản phẩm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateProduct;
