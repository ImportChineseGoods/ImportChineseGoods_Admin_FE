import { Breadcrumb, Divider, Flex, notification, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
const { Text } = Typography;

import { Link, useParams } from 'react-router-dom'
import { orderApi } from '@api/orderApi';
import { formatUnit } from '@helpers/formatUnit';
import Products from '../components/Products';
import BonusOrder from '../components/BonusOrder';


function OrderDetail() {
  const { order_id } = useParams();
  const [order, setOrder] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      const response = await orderApi.getOrderById(order_id);
      if (response.status === 200) {
        setOrder(response.order);
        setProducts(response.order.products);

      } else {
        notification.error({
          message: 'Lỗi khi lấy dữ liệu',
          description: response?.RM || 'Vui lòng thử lại.',
        });
      }
    };
    fetchOrder();
  }, [])

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
            title: order_id
          }
        ]}
      />
      <Divider />
      <Flex gap='20px'>
        <Flex className='detailBox' vertical>
          <h2 style={{textAlign: 'center' }}>Thông tin đơn hàng {order.id}</h2>

          <Flex justify='space-between'>
          <div style={{width: '300px'}}>
              <p className="two-column"><Text strong>Cân nặng: </Text>{formatUnit.weight(order.weight)}</p>
              <p className="two-column"><Text strong>Phí cân nặng: </Text>{formatUnit.weightFee(order.weight_fee)}</p>
              <p className="two-column"><Text strong>Phí vận chuyển: </Text>{formatUnit.moneyVN(order.shipping_fee)}</p>
              <p className="two-column"><Text strong>CK phí vận chuyển ({formatUnit.percent(order.shipping_discount)}): </Text> <Text type="danger">-{formatUnit.moneyVN(order.shipping_discount * order.shipping_fee / 100)}</Text></p>
              <p className="two-column"><Text strong>Phí mua hàng: </Text>{formatUnit.moneyVN(order.purchase_fee)}</p>
              <p className="two-column"><Text strong>CK phí mua hàng ({formatUnit.percent(order.purchase_discount)}): </Text> <Text type="danger">-{formatUnit.moneyVN(order.purchase_discount * order.purchase_fee / 100)}</Text></p>
              <p className="two-column"><Text strong>Phí đóng gói: </Text>{formatUnit.moneyVN(order.packing_fee)}</p>
              <p className="two-column"><Text strong>Phí kiểm đếm: </Text>{formatUnit.moneyVN(order.counting_fee)}</p>
              <p className="two-column"><Text strong>Ghi chú: </Text>{order.note}</p>
            </div>


            <div style={{width: '300px'}}>
              <p className="two-column"><Text strong>Tỷ giá: </Text>{formatUnit.moneyVN(order.applicable_rate)}</p>
              <p className="two-column"><Text strong>Phí phát sinh: </Text>{formatUnit.moneyVN(order.incurred_fee)}</p>
              <p className="two-column"><Text strong>Phí ship nội địa: </Text>({formatUnit.moneyTQ(order.china_shipping_fee)}) {formatUnit.moneyVN(order.china_shipping_fee * order.applicable_rate)}</p>    
              <p className="two-column"><Text strong>Tiền hàng: </Text>({formatUnit.moneyTQ(order.commodity_money)}) {formatUnit.moneyVN(order.commodity_money * order.applicable_rate)}</p>
              <p className="two-column"><Text strong>Tổng đơn: </Text>{formatUnit.moneyVN(order.total_amount)}</p>
              <p className="two-column"><Text strong>Đã thanh toán: </Text><Text type="success">{formatUnit.moneyVN(order.amount_paid || 0)}</Text></p>
              <p className="two-column"><Text strong>Còn nợ: </Text><Text type="danger">{formatUnit.moneyVN(order.outstanding_amount)}</Text></p>
              <p className="two-column"><Text strong>Kho nhận hàng: </Text>{order.warehouse?.name}</p>
              <p className="two-column"><Text strong>Mã vận đơn:</Text><Text mark>{order?.bol?.bol_code}</Text></p>
            </div>
          </Flex>
          <Divider />
          <Products data={products}></Products>

        </Flex>
        <Flex vertical className='detailBox' style={{ width: '500px' }}>
          <BonusOrder data={order} ></BonusOrder>
        </Flex>
      </Flex>
    </div>
  )
}

export default OrderDetail