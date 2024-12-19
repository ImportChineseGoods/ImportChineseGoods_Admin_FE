import { Breadcrumb, Button, Card, Divider, Dropdown, Flex, notification, Popover, Space, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
const { Text, Paragraph } = Typography;

import { Link, useParams } from 'react-router-dom';
import { orderApi } from '@api/orderApi';
import { formatUnit } from '@helpers/formatUnit';
import Products from '../components/Products';
import Histories from '../../../generals/components/components/Histories';
import formatDate from '@helpers/formatDate';
import statusTagMapping from '@components/components/tag';
import OrderManagement from '../components/OrderManagement';

const OrderDetail = () => {
  const { order_id } = useParams();
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [locked, setLocked] = useState(false);
  const StatusTag = statusTagMapping[order?.status];
  const statusList = ['cancelled', 'exported'];

  useEffect(() => {
    const fetchOrder = async () => {
      const response = await orderApi.getOrderById(order_id);
      if (response.status === 200) {
        setOrder(response.order);
        setProducts(response.order.products);
        setLocked(statusList.includes(response.order.status));
      } else {
        notification.error({
          message: 'Lỗi khi lấy dữ liệu',
          description: response?.RM || 'Vui lòng thử lại.',
        });
      }
    };
    setLoading(true);
    fetchOrder();
    setLoading(false);
  }, [order_id]);

  return (
    <div>
      <Breadcrumb
        items={[
          {
            title: <Link to="/">Trang chủ</Link>,
          },
          {
            title: <Link to="/orders">Đơn đặt hàng</Link>,
          },
          {
            title: order_id,
          },
        ]}
      />
      <Divider />
      <Flex vertical gap="20px">
        <Card loading={loading} className="detailBox" >
          <Flex justify="space-between">
            <div style={{ width: '300px' }}>
              <div className="two-column">
                <Text strong>Mã đơn hàng: </Text>
                {order.id}
              </div>
              <div className="two-column">
                <Text strong>Khách hàng: </Text>
                {order.customer?.name} - {order.customer_id}
              </div>
              <div className="two-column">
                <Text strong>Tỷ giá áp dụng: </Text>
                {formatUnit.moneyVN(order.applicable_rate)}
              </div>
              <div className="two-column">
                <Text strong>Tỷ giá gốc: </Text>
                {formatUnit.moneyVN(order.original_rate)}
              </div>
              <div className="two-column">
                <Text strong>Ngày tạo: </Text>
                {formatDate(order.create_at)}
              </div>
              <div className="two-column">
                <Text strong>Ngày cập nhật: </Text>
                {formatDate(order.update_at)}
              </div>
              <div className="two-column">
                <Text strong>Kho nhận hàng: </Text>
                {order.warehouse?.name}
              </div>
              <div className="two-column">
                <Text strong>Trạng thái: </Text>
                {StatusTag ? 
                <Popover 
                  content={<Histories data={order.histories} />}
                  trigger="hover"
                  placement="bottom"> 
                  <Space><StatusTag /></Space>
                </Popover> 
                : <Tag color="default">Không xác định</Tag>}
              </div>
              <div className="two-column">
                <Text strong>Ghi chú: </Text>
                {order.note}
              </div>
            </div>

              <div style={{ width: '300px' }}>
                <div className="two-column">
                  <Text strong>Tiền hàng: </Text>
                  ({formatUnit.moneyTQ(order.commodity_money)}) {formatUnit.moneyVN(order.commodity_money * order.applicable_rate)}
                </div>
                <div className="two-column">
                  <Text strong>Phí ship nội địa: </Text>
                  ({formatUnit.moneyTQ(order.china_shipping_fee)}) {formatUnit.moneyVN(order.china_shipping_fee * order.applicable_rate)}
                </div>
                <div className="two-column">
                  <Text strong>Phí mua hàng: </Text>
                  {formatUnit.moneyVN(order.purchase_fee)}
                </div>
                <div className="two-column">
                  <Text strong>
                    CK phí mua hàng: ({formatUnit.percent(order.purchase_discount)})
                  </Text>
                  <Text type="danger">-{formatUnit.moneyVN(order.purchase_discount * order.purchase_fee / 100)}</Text>
                </div>
                <div className="two-column">
                  <Text strong>Cân nặng: </Text>
                  {formatUnit.weight(order.weight)}
                </div>
                <div className="two-column">
                  <Text strong>Phí cân nặng: </Text>
                  {formatUnit.weightFee(order.weight_fee)}
                </div>
                <div className="two-column">
                  <Text strong>Phí cân nặng gốc: </Text>
                  {formatUnit.weightFee(order.original_weight_fee)}
                </div>
                <div className="two-column">
                  <Text strong>Phí vận chuyển: </Text>
                  {formatUnit.moneyVN(order.shipping_fee)}
                </div>
                <div className="two-column">
                  <Text strong>
                    CK phí vận chuyển: ({formatUnit.percent(order.shipping_discount)})
                  </Text>
                  <Text type="danger">-{formatUnit.moneyVN(order.shipping_discount * order.shipping_fee / 100)}</Text>
                </div>
              </div>
              <div style={{ width: '300px' }}>
                <div className="two-column">
                  <Text strong>Số sản phẩm: </Text>
                  {formatUnit.number(order?.number_of_product)}
                </div>
                <div className="two-column">
                  <Text strong>Phí đóng gói: </Text>
                  {formatUnit.moneyVN(order.packing_fee)}
                </div>
                <div className="two-column">
                  <Text strong>Phí kiểm đếm: </Text>
                  {formatUnit.moneyVN(order.counting_fee)}
                </div>
                <div className="two-column">
                  <Text strong>Phí phát sinh: </Text>
                  {formatUnit.moneyVN(order.incurred_fee)}
                </div>
                <div className="two-column">
                  <Text strong>Tổng đơn: </Text>
                  {formatUnit.moneyVN(order.total_amount)}
                </div>
                <div className="two-column">
                  <Text strong>Đã thanh toán: </Text>
                  <Text type="success">{formatUnit.moneyVN(order.amount_paid || 0)}</Text>
                </div>
                <div className="two-column">
                  <Text strong>Còn nợ: </Text>
                  <Text type="danger">{formatUnit.moneyVN(order.outstanding_amount)}</Text>
                </div>
                <div className="two-column">
                  <Text strong>Mã hợp đồng: </Text>
                  <Paragraph copyable>{order?.contract_code}</Paragraph>
                </div>
                <div className="two-column">
                  <Text strong>Mã vận đơn:</Text>
                  <Paragraph copyable>{order?.bol?.bol_code}</Paragraph>
                </div>
              </div>
          </Flex>
        </Card>
        <Flex gap="20px">
          <Card loading={loading} className="detailBox">
            <h3 style={{ textAlign: 'center' }}>Danh sách sản phẩm</h3>
            <Products data={products} applicable_rate={order.applicable_rate} locked={locked}></Products>
          </Card>
          <Card loading={loading} className="detailBox" style={{ width: '800px' }}>
          <h3 style={{ textAlign: 'center' }}>Quản lý đơn hàng</h3>
            <OrderManagement data={order} locked={locked}/>
          </Card>
        </Flex>
      </Flex>
    </div>
  );
};

export default OrderDetail;