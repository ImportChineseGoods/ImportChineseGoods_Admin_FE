import Histories from '@components/components/Histories'
import statusTagMapping from '@components/components/tag'
import formatDate from '@helpers/formatDate'
import { formatUnit } from '@helpers/formatUnit'
import { Flex, Form, Typography, Table, Popover, Tag, Space } from 'antd'
import { resetWarned } from 'antd/es/_util/warning'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const { Text } = Typography

function OrderList({ data, setSelectedRowKeys, setSelectedRows }) {

  const [orders, setOrders] = useState([])
  useEffect(() => {
    setOrders(data.map((order, index) => ({ ...order, key: index + 1 }))) 
  }, [data])

  console.log(orders)

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
          title: 'Thông tin tài chính',
          render: (_, record) => {
            const amount_paid = record.amount_paid === null ? formatUnit.moneyVN(0) : formatUnit.moneyVN(record.amount_paid);
            return (
              <Flex justify='space-between'>
                <Flex vertical>
                  <p>Tổng đơn:</p>
                  <Text type="success">Đã thanh toán:</Text>
                  <Text type="danger">Còn nợ:</Text>
                </Flex>
                <Flex vertical justify='flex-end' style={{ textAlign: 'end' }}>
                  <Text>{formatUnit.moneyVN(record.total_amount)}</Text>
                  <Text type="success">{amount_paid}</Text>
                  <Text type="danger">{formatUnit.moneyVN(record.outstanding_amount)}</Text>
                </Flex>
              </Flex>
            );
          }
        },
        {
          title: 'Cân nặng (kg)',
          dataIndex: 'weight',
          render: (weight) => formatUnit.weight(weight),
          width: '10%', 
        },
        {
          title: 'Trạng thái',
          dataIndex: 'status',
          width: '10%', 
          render: (_, record) => {
            const StatusTag = statusTagMapping[record.status];
            return (
              <Flex vertical>
                {StatusTag ?
                  <Popover
                    content={<Histories data={record.histories} />}
                    trigger="hover"
                    placement="bottom">
                    <Space><StatusTag /></Space>
                  </Popover>
                  : <Tag color="default">Không xác định</Tag>}
                <Text>{formatDate(record.update_at)}</Text>
              </Flex>
            )
          },
        }
      ];
  return (
    <Table
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRowKeys(selectedRowKeys);
              setSelectedRows(selectedRows);
            },
          }}
          dataSource={orders}
          columns={columns}
          pagination={false}
          bordered
        />
  )
}

export default OrderList