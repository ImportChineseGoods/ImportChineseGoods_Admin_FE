import { consignmentApi } from '@api/consignmentApi';
import statusTagMapping from '@components/components/tag';
import formatDate from '@helpers/formatDate';
import { formatUnit } from '@helpers/formatUnit';
import { Breadcrumb, Divider, Flex, notification, Tag, Timeline, Card, Typography, Popover, Space } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import ConsignmentManagement from '../components/ConsignmentManagement';
import Histories from '@components/components/Histories';
const { Text, Paragraph } = Typography;

function ConsignmentDetail() {
    const { consignment_id } = useParams();
    const [consignment, setConsignment] = useState({});
    const [loading, setLoading] = useState(true);
    const [locked, setLocked] = useState(false);

    const StatusTag = statusTagMapping[consignment?.status];
    const statusList = ['exported', 'cancelled'];

    useEffect(() => {
        const fetchConsignment = async () => {
            const response = await consignmentApi.getConsignmentById(consignment_id);
            if (response.status === 200) {
                setConsignment(response.consignment);
                setLocked(statusList.includes(response.consignment.status));
            } else {
                notification.error({
                    message: 'Lỗi khi lấy dữ liệu',
                    description: response?.RM || 'Vui lòng thử lại.',
                });
            }
        };
        setLoading(true);
        fetchConsignment();
        setLoading(false);
    }, [])

    return (
        <div>
            <Breadcrumb
                items={[
                    {
                        title: <Link to="/">Trang chủ</Link>,
                    },
                    {
                        title: <Link to="/consignments">Đơn ký gửi</Link>,
                    },
                    {
                        title: consignment_id
                    }
                ]}
            />
            <Divider />
            <Flex gap="20px">
                <Card loading={loading} className="detailBox" >
                    <Flex gap='40px' justify="space-between">
                        <div style={{ width: '300px' }}>
                            <div className="two-column">
                                <Text strong>Mã đơn hàng: </Text>
                                {consignment.id}
                            </div>
                            <div className="two-column">
                                <Text strong>Khách hàng: </Text>
                                {consignment.customer?.name} - {consignment.customer_id}
                            </div>
                            <div className="two-column">
                                <Text strong>Ngày tạo: </Text>
                                {formatDate(consignment.create_at)}
                            </div>
                            <div className="two-column">
                                <Text strong>Ngày cập nhật: </Text>
                                {formatDate(consignment.update_at)}
                            </div>
                            <div className="two-column">
                                <Text strong>Kho nhận hàng: </Text>
                                {consignment.warehouse?.name}
                            </div>
                            <div className="two-column">
                                <Text strong>Trạng thái: </Text>
                                {StatusTag ?
                                    <Popover
                                        content={<Histories data={consignment.histories} />}
                                        trigger="hover"
                                        placement="bottom">
                                        <Space><StatusTag /></Space>
                                    </Popover>
                                    : <Tag color="default">Không xác định</Tag>}
                            </div>

                            <div className="two-column">
                                <Text strong>Mã vận đơn:</Text>
                                <Paragraph copyable>{consignment.bol?.bol_code}</Paragraph>
                            </div>
                            <div className="two-column">
                                <Text strong>Ghi chú: </Text>
                                {consignment.note}
                            </div>
                        </div>

                        <div style={{ width: '300px' }}>
                            <div className="two-column">
                                <Text strong>Cân nặng: </Text>
                                {formatUnit.weight(consignment.weight)}
                            </div>
                            <div className="two-column">
                                <Text strong>Phí cân nặng: </Text>
                                {formatUnit.weightFee(consignment.weight_fee)}
                            </div>
                            <div className="two-column">
                                <Text strong>Phí cân nặng gốc: </Text>
                                {formatUnit.weightFee(consignment.original_weight_fee)}
                            </div>
                            <div className="two-column">
                                <Text strong>Phí vận chuyển: </Text>
                                {formatUnit.moneyVN(consignment.shipping_fee)}
                            </div>
                            <div className="two-column">
                                <Text strong>
                                    CK phí vận chuyển: ({formatUnit.percent(consignment.shipping_discount)})
                                </Text>
                                <Text type="danger">-{formatUnit.moneyVN(consignment.shipping_discount * consignment.shipping_fee / 100)}</Text>
                            </div>
                            <div className="two-column">
                                <Text strong>Phí phát sinh: </Text>
                                {formatUnit.moneyVN(consignment.incurred_fee)}
                            </div>
                            <div className="two-column">
                                <Text strong>Tổng đơn: </Text>
                                {formatUnit.moneyVN(consignment.total_amount)}
                            </div>
                            <div className="two-column">
                                <Text strong>Đã thanh toán: </Text>
                                <Text type="success">{formatUnit.moneyVN(consignment.amount_paid || 0)}</Text>
                            </div>
                            <div className="two-column">
                                <Text strong>Còn nợ: </Text>
                                <Text type="danger">{formatUnit.moneyVN(consignment.outstanding_amount)}</Text>
                            </div>

                        </div>
                    </Flex>
                </Card>
                <Card loading={loading} className="detailBox" style={{ width: '800px' }}>
                    <h3 style={{ textAlign: 'center' }}>Quản lý đơn hàng</h3>
                    <ConsignmentManagement data={consignment} locked={locked} />
                </Card>
            </Flex>
        </div>
    )
}

export default ConsignmentDetail