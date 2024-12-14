import React from 'react';
import { Alert, Button, Space } from 'antd';
const AlertDelete = () => (
    <Alert
      message="Xác nhận xóa sản phẩm"
      description="Thao tác này không thể hoàn tác"
      type="info"
      action={
        <Space direction="vertical">
          <Button size="small" type="primary">
            Xác nhận
          </Button>
          <Button size="small" danger ghost>
            Hủy
          </Button>
        </Space>
      }
      closable
      style={{
        position: 'fixed',
        right: '50px',
        top: '100px',
      }}
    />
);
export default AlertDelete;