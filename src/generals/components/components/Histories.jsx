import { Button, Divider, Flex, notification, Timeline, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
const { Text } = Typography;

import formatDate from '@helpers/formatDate';

import statusTagMapping from '@components/components/tag';

function Histories({ data }) {
  const [histories, setHistories] = useState([]);

  useEffect(() => {
    setHistories(data?.map((history) => {
      const StatusTag = statusTagMapping[history?.status];
      return {
        key: history.id,
        label: `${formatDate(history.create_at)} ${history?.employee ? `by ${history.employee.name}` : ''}`,
        children: <StatusTag />,
      };
    }));
  }, [data]);

  return (
      <Flex vertical justify='center' style={{ width: '350px', marginTop: '20px' }}>
          <Timeline
            mode="right"
            items={histories}
            style={{ width: '100%' }}
          />
      </Flex>
  );
}

export default Histories;
