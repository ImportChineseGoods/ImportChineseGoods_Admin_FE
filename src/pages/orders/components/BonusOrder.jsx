import { Button, Divider, Flex, notification, Timeline, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
const { Text } = Typography;

import { useParams, useLocation, useNavigate } from 'react-router-dom';
import formatDate from '@helpers/formatDate';

import statusTagMapping from '@components/components/tag';
import { formatUnit } from '@helpers/formatUnit';
import { adminData } from '@api/adminDataApi';
import { transactionApi } from '@api/transactionApi';

function BonusOrder({ data }) {
  const [histories, setHistories] = useState([]);

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

  return (
      <Flex vertical>
        <div>
          <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Lịch sử đơn hàng</h3>
          <Timeline
            mode="right"
            items={histories}
            style={{ width: '100%' }}
          />
        </div>
      </Flex>
  );
}

export default BonusOrder;
