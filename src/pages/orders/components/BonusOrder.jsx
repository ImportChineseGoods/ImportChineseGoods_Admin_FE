import { Button, Divider, Flex, notification, Timeline, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
const { Text } = Typography;

import { useParams, useLocation, useNavigate } from 'react-router-dom';
import formatDate from '@helpers/formatDate';

import statusTagMapping from '@components/components/tag';
import { formatUnit } from '@helpers/formatUnit';
import { getData } from '@api/getDataApi';
import { transactionApi } from '@api/transactionApi';

function BonusOrder({ data }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [histories, setHistories] = useState([]);
  const [user, setUser] = useState({});
  const { order_id } = useParams();

  const visible = !location.pathname.endsWith('/deposit');


  useEffect(() => {
    const fetchUser = async () => {
      const response = await getData.orderDepositData();
      if (response.status === 200) {
        setUser(response.customer);
      } else {
        notification.error({
          message: 'Lỗi khi lấy dữ liệu',
          description: response?.RM || 'Vui lòng thử lại.',
        });
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    setHistories(data.histories?.map((history) => {
      const StatusTag = statusTagMapping[history?.status];
      return {
        key: history.id,
        label: `${formatDate(history.create_at)} ${history?.employee ? `by ${history.employee}` : ''}`,
        children: <StatusTag />,
      };
    }));
  }, [data.histories]);

  const handleDeposit = async () => {
    const response = await transactionApi.depositOrder(value, order_id);
    if (response.status === 200) {
      notification.success({
        message: 'Đặt cọc thành công',
        description: 'Đơn hàng của bạn đã được đặt cọc.',
      });
      navigate(`/orders/${order_id}`);
    } else {
      notification.error({
        message: 'Lỗi khi đặt cọc',
        description: response?.RM || 'Vui lòng thử lại.',
      });
    }
  }

  const value = Math.round(data.commodity_money * data.applicable_rate * user.deposit_rate / 100 - data.amount_paid);
  const isDeposited = data?.status === 'waiting_deposit';
  const isBalance = user.balance >= value;

  return (
    visible ? (
      <Flex vertical>
        <div>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Lịch sử đơn hàng</h2>
          <Timeline
            mode="right"
            items={histories}
            style={{ width: '100%' }}
          />
        </div>

        {isDeposited && <Button color="primary" variant="solid" onClick={() => navigate(`/orders/${order_id}/deposit`)}>
          Đặt cọc
        </Button>}
      </Flex>
    ) : (
      <div>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Chi tiết đặt cọc</h2>
        <Flex vertical gap='small'>
          <p className="two-column"><Text strong>Tỷ giá: </Text>{formatUnit.moneyVN(data.applicable_rate)}</p>
          <p className="two-column"><Text strong>Kho nhận hàng: </Text>{data.warehouse?.name}</p>
          <p className="two-column"><Text strong>Tổng đơn: </Text>{formatUnit.moneyVN(data.total_amount)}</p>
          <p className="two-column"><Text strong>Tiền hàng: </Text>({formatUnit.moneyTQ(data.commodity_money)}) {formatUnit.moneyVN(data.commodity_money * data.applicable_rate)}</p>
          <p className="two-column"><Text strong>Đã thanh toán: </Text><Text type="success">{formatUnit.moneyVN(data.amount_paid || 0)}</Text></p>

          <Divider />
          <h3 className="two-column"><Text strong>Số tiền đặt cọc: ({formatUnit.percent(user.deposit_rate)}) </Text><Text type="danger">{formatUnit.moneyVN(value)}</Text></h3>
          {isBalance ? <Button color="primary" variant="solid" onClick={() => handleDeposit()}>
            Đặt cọc
          </Button> : <Text type="danger">Số dư của bạn không đủ, nạp thêm để đặt cọc!</Text>}
          
        </Flex>
      </div>
    )
  );
}

export default BonusOrder;
