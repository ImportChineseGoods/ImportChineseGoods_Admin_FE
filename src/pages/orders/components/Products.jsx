import React, { useEffect, useState } from 'react';
import { Button, Typography, InputNumber, Table, Input, Image, notification } from 'antd';
import { formatUnit } from '@helpers/formatUnit';
import { productApi } from '@api/productApi';
import { useNavigate } from 'react-router-dom';
const { Link } = Typography;

const Products = ({ data, applicable_rate, locked }) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState(data.map((product) => ({ ...product, key: product.id })));

    // Cập nhật state mỗi khi prop data thay đổi
    useEffect(() => {
        setProducts(data.map((product) => ({ ...product, key: product.id })));
    }, [data]);

    // Hàm xử lý khi số lượng hoặc đơn giá thay đổi
    const handleChange = (key, field, value) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.key === key ? { ...product, [field]: value } : product
            )
        );
    };

    // Hàm gọi API cập nhật sản phẩm
    const updateProducts = async () => {
        products.forEach(async (product) => {
            console.log(product);
            const res = await productApi.updateProduct(product);
            if (res.status !== 200) {
                notification.error({
                    message: 'Cập nhật thất bại',
                    description: res?.RM || 'Có lỗi xảy ra khi cập nhật sản phẩm.',
                });
                return;
            }
        });

        notification.success({
            message: 'Cập nhật thành công',
        });
        setTimeout(() => {
            navigate(0); // Reload trang
        }, 1000);
    };

    // Cấu hình cột của bảng
    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'name',
            render: (_, record) => (
                <div className="productBox">
                    <div>
                        <Image width={80} height={80} src={record.image_url} />
                    </div>
                    <div>
                        <Link href={record.link} target='_blank'>{record.name}</Link>
                        <p>Thuộc tính: {record.description}</p>
                        <p>Ghi chú: {record.note}</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            render: (quantity, record) => (
                <InputNumber
                    min={1}
                    value={quantity}
                    onChange={(value) => handleChange(record.key, 'quantity', value)}
                    disabled={locked}
                />
            ),
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            render: (price, record) => {
                const numericPrice = parseFloat(price) || 0;
                return (
                    <div>
                        <InputNumber
                            min={0}
                            value={numericPrice}
                            onChange={(value) => handleChange(record.key, 'price', value)}
                            disabled={locked}
                        />
                        <p>({formatUnit.moneyVN(numericPrice * applicable_rate)})</p>
                    </div>
                );
            },
        },
        {
            title: 'Thành tiền',
            dataIndex: 'money',
            render: (_, record) => {
                const price = parseFloat(record.price) || 0;
                const total = price * record.quantity;
                return (
                    <div>
                        <p>{formatUnit.moneyTQ(total)}</p>
                        <p>({formatUnit.moneyVN(total * applicable_rate)})</p>
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            {/* Bảng sản phẩm */}
            <Table
                columns={columns}
                dataSource={products}
                bordered
                pagination={false}
                style={{ marginTop: '20px' }}
            />

            {/* Nút lưu */}
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <Button type="primary" onClick={updateProducts} disabled={locked}>
                    Lưu
                </Button>
            </div>
        </div>
    );
};

export default Products;
