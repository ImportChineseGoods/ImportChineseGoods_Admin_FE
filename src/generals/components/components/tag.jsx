import React from 'react';
import { Tag } from 'antd';

const WaitingDeposit = () => <Tag color="processing">Chờ đặt cọc</Tag>;
const Deposited = () => <Tag color="success">Đã đặt cọc</Tag>;
const Ordering = () => <Tag color="warning">Đang đặt hàng</Tag>;
const Ordered = () => <Tag color="geekblue">Đã đặt hàng</Tag>;
const ShopShipping = () => <Tag color="magenta">Shop xưởng giao</Tag>;
const ChinaWarehouseReceived = () => <Tag color="orange">Kho TQ nhận</Tag>;
const VietnamWarehouseReceived = () => <Tag color="blue">Kho VN nhận</Tag>;
const WaitingExport = () => <Tag color="purple">Chờ xuất kho</Tag>;
const Exported = () => <Tag color="cyan">Đã xuất kho</Tag>;
const Pending = () => <Tag color="warning">Chờ xử lý</Tag>;
const Processing = () => <Tag color="processing">Đang xử lý</Tag>;
const Completed = () => <Tag color="success">Đã xử lý</Tag>;
const Cancelled = () => <Tag color="error">Đã hủy</Tag>;

const statusTagMapping = {
  waiting_deposit: WaitingDeposit,
  deposited: Deposited,
  ordering: Ordering,
  ordered: Ordered,
  shop_shipping: ShopShipping,
  china_warehouse_received: ChinaWarehouseReceived,
  vietnam_warehouse_received: VietnamWarehouseReceived,
  waiting_export: WaitingExport,
  exported: Exported,
  pending: Pending,
  processing: Processing,
  completed: Completed,
  cancelled: Cancelled,
};

export default statusTagMapping;
