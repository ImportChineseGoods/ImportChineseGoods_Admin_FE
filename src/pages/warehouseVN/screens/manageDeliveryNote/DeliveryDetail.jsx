import { PrinterOutlined } from '@ant-design/icons';
import { deliveryApi } from '@api/deliverynoteApi';
import statusTagMapping from '@components/components/tag';
import formatDate from '@helpers/formatDate';
import { formatUnit } from '@helpers/formatUnit';
import { Breadcrumb, Button, Card, Divider, Flex, notification, Space, Table, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

const { Title, Text } = Typography;

function DeliveryDetail() {
  const { delivery_id } = useParams();
  const navigation = useNavigate();
  const [delivery, setDelivery] = useState({});
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [waitingExport, setWaitingExport] = useState();
  const [exported, setExported] = useState();
  const [exportDate, setExportDate] = useState();

  const StatusTag = delivery?.status ? statusTagMapping[delivery.status] : null;

  useEffect(() => {
    const fetchDelivery = async () => {
      const response = await deliveryApi.getDeliveryById(delivery_id);
      if (response.status === 200) {
        setDelivery(response.deliveryNote);
        setOrders(response.deliveryNote.type === 'order' ? response.deliveryNote?.orders : response.deliveryNote?.consignments);
      } else {
        notification.error({
          message: 'Lỗi khi lấy dữ liệu',
          description: response?.RM || 'Vui lòng thử lại.',
        });
      }
    };
    setLoading(true);
    fetchDelivery();
    setLoading(false);
  }, [delivery_id]);

  useEffect(() => {
    setWaitingExport(delivery?.histories
      ?.find(item => item.status === "waiting_export" && item.employee)?.employee.name || null)

    setExported(delivery?.histories
      ?.find(item => item.status === "exported" && item.employee)?.employee.name || null)

    setExportDate(delivery?.histories
      ?.find(item => item.status === "exported" && item.update_at)?.update_at || null)

  }, [delivery]);

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      rowScope: 'row',
      width: '4%'
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      width: '10%',
    },
    {
      title: 'Mã vận đơn',
      render: (_, record) => record.bol.bol_code,
      width: '10%',
    },
    {
      title: 'Cân nặng (kg)',
      dataIndex: 'weight',
      render: (weight) => formatUnit.weight(weight),
      width: '10%',
    },
  ];


  const handleExport = async () => {
    const response = await deliveryApi.exportDelivery(delivery_id);
    if (response.status === 200) {
      notification.success({
        message: 'Xuất kho thành công',
      });
      setTimeout(() => {
        navigation(0);
      }, 1000);

    } else {
      notification.error({
        message: 'Lỗi khi xuất kho',
        description: response?.RM || 'Vui lòng thử lại.',
      });
    }
  }

  const handlePrint = useReactToPrint({
    content: () => document.querySelector('.print-section')
  });

  return (
    <div>
      <Breadcrumb
        items={[
          {
            title: <Link to="/">Trang chủ</Link>,
          },
          {
            title: <Link to="/delivery-notes">Phiếu xuất kho</Link>,
          },
          {
            title: delivery_id,
          },
        ]}
      />
      <Divider />

      <Flex justify='end' gap='20px' style={{ margin: '10px' }}>
        <Button color="primary" variant="link" onClick={handlePrint}>In phiếu <PrinterOutlined /></Button>
        <Button color="danger" variant="filled" onClick={handleExport}>Xuất kho</Button>
      </Flex>
      <div className='className="print-section"'>
        <Card loading={loading} gap="20px" className='detailBox' style={{ textAlign: 'center' }}>

          <Flex vertical gap="0">
            <Title level={4} >Phiếu xuất kho Việt Nam</Title>
            <Text type="secondary">(Mã phiếu: {delivery.id})</Text>
          </Flex>

          <Divider />

          <Flex gap="20px" justify="space-between">
            <div style={{ width: '300px' }}>
              <div className="two-column">
                <Text strong>Tên khách hàng: </Text>
                {delivery.customer?.name}
              </div>
              <div className="two-column">
                <Text strong>Mã khách hàng: </Text>
                {delivery.customer?.id}
              </div>
              <div className="two-column">
                <Text strong>Số điện thoại: </Text>
                {delivery.customer?.phone}
              </div>
              <div className="two-column">
                <Text strong>Kho xuất hàng: </Text>
                Kho Việt Nam
              </div>
              <div className="two-column">
                <Text strong>Trạng thái: </Text>
                {StatusTag ? <StatusTag /> : <Tag color="default">Không xác định</Tag>}
              </div>
              <div className="two-column">
                <Text strong>Ghi chú: </Text>
                {delivery.note}
              </div>
            </div>

            <div style={{ width: '300px' }}>
              <div className="two-column">
                <Text strong>Nhân viên tạo: </Text>
                {waitingExport}
              </div>
              <div className="two-column">
                <Text strong>Nhân viên xuất kho: </Text>
                {exported}
              </div>
              <div className="two-column">
                <Text strong>Ngày tạo: </Text>
                {formatDate(delivery.create_at)}
              </div>
              <div className="two-column">
                <Text strong>Ngày xuất kho: </Text>
                {exportDate ? formatDate(exportDate) : ''}
              </div>
            </div>

            <div style={{ width: '300px' }}>
              <div className='two-column'>
                <Text strong>Số lượng đơn hàng: </Text>
                {delivery.number_of_order}
              </div>
              <div className='two-column'>
                <Text strong>Tổng cân nặng: </Text>
                {formatUnit.weight(delivery.total_weight)}
              </div>
              <div className='two-column'>
                <Text strong>Phí phát sinh: </Text>
                {formatUnit.moneyVN(delivery.incurred_fee)}
              </div>
              <div className='two-column'>
                <Text strong>Tổng tiền: </Text>
                {formatUnit.moneyVN(delivery.total_amount)}
              </div>
              <div className='two-column'>
                <Text strong>Đã thanh toán: </Text>
                {formatUnit.moneyVN(delivery.amount_paid)}
              </div>
              <div className='two-column'>
                <Text strong>Còn nợ: </Text>
                {formatUnit.moneyVN(delivery.outstanding_amount)}
              </div>
            </div>

          </Flex>

          <Divider />

          <Flex justify='center' align='center'>
            <Table
              columns={columns}
              dataSource={orders.map((order, index) => ({ ...order, key: index + 1 }))}
              pagination={false}
              rowKey="id"
              style={{ width: '80%' }}
            />
          </Flex>

          <Divider />

          <Flex justify='space-around' style={{ marginBottom: '100px' }} >
            <Flex vertical gap='10px'>
              <Text strong>Người nhận</Text>
              <Text type='secondary'>(Ký và ghi rõ họ tên)</Text>
            </Flex>
            <Flex vertical gap='10px'>
              <Text strong>Người xuất hàng</Text>
              <Text type='secondary'>(Ký và ghi rõ họ tên)</Text>
            </Flex>
          </Flex>

        </Card>
      </div>
    </div>
  )
}

export default DeliveryDetail