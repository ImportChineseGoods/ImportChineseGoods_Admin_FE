import React, { useEffect, useState } from 'react';
import { Button, Input, InputNumber, Form, Upload, notification, Breadcrumb, Divider, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import uploadImageToCloudinary from '@generals/utils/uploadImage';
import { Link } from 'react-router-dom';
import { complaintApi } from '@api/complaintApi';
import TextArea from 'antd/es/input/TextArea';
import { getData } from '@api/getDataApi';
import { complaintArray } from '@generals/constants/AppResource';

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


const CreateComplaint = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState('');
    const [fileList, setFileList] = useState([]);
    const [dataOrder, setDataOrder] = useState({});
    const [orderType, setOrderType] = useState([]);
    const [orderData, setOrderData] = useState('')
    const handleData = (value) => {
        setOrderType(dataOrder[value]);
        setOrderData(null);
    };
    const handlCheck = (value) => {
        setOrderData(value);
    };

    const selectData = [{
        label: 'Đơn đặt hàng',
        value: 'orders',
    }, {
        label: 'Đơn ký gửi',
        value: 'consignments',
    }];

    useEffect(() => {
        const fetchOrder = async () => {
            const res = await getData.complaintOrderData();
            if (res.status === 200) {
                setDataOrder(res.data);
            }
        };
        fetchOrder();
    }, []);

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
        const res = await complaintApi.create({
            type: values.type,
            order_id: values.order_type === 'orders' ? orderData : null,
            consignment_id: values.order_type === 'consignments' ? orderData : null,
            description: values.description,
            image_url: formData.get('image_url') || null,
        });
        if (res.status === 200) {
            notification.success({
                message: 'Tạo khiếu nại thành công',
                description: res?.RM ?? "",
            });

            setFileList([]);
            form.resetFields();
            setLoading('');

        } else {
            notification.error({
                message: 'Có lỗi xảy ra khi tạo khiếu nại!',
                description: res?.RM ?? "",
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
                        title: <Link to="/complaints">Khiếu nại</Link>,
                    },
                    {
                        title: 'Tạo khiếu nại',
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
                    label="Loại khiếu nại"
                    name="type"
                    rules={[{ required: true, message: 'Hãy chọn loại khiếu nại!' }]}
                >
                    <Select
                        placeholder="Chọn loại khiếu nại"
                        options={complaintArray}
                    />
                </Form.Item>

                <Form.Item
                    label="Loại đơn hàng"
                    name="order_type"
                    rules={[{ required: true, message: 'Hãy chọn loại đơn!' }]}
                >
                    <Select
                        placeholder="Chọn loại đơn hàng"
                        onChange={handleData}
                        options={selectData}
                    />
                </Form.Item>

                <Form.Item
                    label="Đơn hàng"
                    name="order"
                    rules={[{ required: true, message: 'Hãy chọn đơn hàng!' }]}
                >
                    <Select
                        showSearch
                        placeholder="Chọn đơn hàng"
                        onChange={handlCheck}
                        options={orderType.map((item) => ({
                            label: item.id,
                            value: item.id,
                        }))}
                    />
                </Form.Item>

                <Form.Item label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: 'Hãy nhập mô tả khiếu nại!' }]}>
                    <TextArea />
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
                        Tạo khiếu nại
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreateComplaint;
