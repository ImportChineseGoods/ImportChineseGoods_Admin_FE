import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFound = () => (
  <Result
    status="404"
    title="404"
    subTitle="Trang bạn đang tìm kiếm không tồn tại"
    extra={<Button type="primary">Back Home</Button>}
  />
);
export default NotFound;