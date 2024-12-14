import { consignmentApi } from '@api/consignmentApi';
import statusTagMapping from '@components/components/tag';
import formatDate from '@helpers/formatDate';
import { formatUnit } from '@helpers/formatUnit';
import { Breadcrumb, Divider, Flex, notification, Timeline, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
const { Text } = Typography;

function ConsignmentDetail() {
    const { consignment_id } = useParams();
    const [consignment, setConsignment] = useState({});
    const [histories, setHistories] = useState([]);

    useEffect(() => {
        const fetchConsignment = async () => {
            const response = await consignmentApi.getConsignmentById(consignment_id);
            if (response.status === 200) {
                console.log(response);
                setConsignment(response.consignment);
                setHistories(response.consignment.histories);

            } else {
                notification.error({
                    message: 'Lỗi khi lấy dữ liệu',
                    description: response?.RM || 'Vui lòng thử lại.',
                });
            }
        };
        fetchConsignment();
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
            <Flex gap='20px'>
                <Flex className='detailBox' vertical>
                    <h2 style={{ textAlign: 'center' }}>Thông tin đơn hàng {consignment.id}</h2>

                    <Flex justify='space-between'>
                        <div style={{ width: '300px' }}>
                            <p className="two-column"><Text strong>Cân nặng: </Text>{formatUnit.weight(consignment.weight)}</p>
                            <p className="two-column"><Text strong>Phí cân nặng: </Text>{formatUnit.weightFee(consignment.weight_fee)}</p>
                            <p className="two-column"><Text strong>Phí vận chuyển: </Text>{formatUnit.moneyVN(consignment.shipping_fee)}</p>
                            <p className="two-column"><Text strong>CK phí vận chuyển ({formatUnit.percent(consignment.shipping_discount)}): </Text> <Text type="danger">-{formatUnit.moneyVN(consignment.shipping_discount * consignment.shipping_fee / 100)}</Text></p>
                            <p className="two-column"><Text strong>Ghi chú: </Text>{consignment.note}</p>
                            <p className="two-column"><Text strong>Phí phát sinh: </Text>{formatUnit.moneyVN(consignment.incurred_fee)}</p>
                        </div>


                        <div style={{ width: '300px' }}>
                            <p className="two-column"><Text strong>Tổng đơn: </Text>{formatUnit.moneyVN(consignment.total_amount)}</p>
                            <p className="two-column"><Text strong>Đã thanh toán: </Text><Text type="success">{formatUnit.moneyVN(consignment.amount_paid || 0)}</Text></p>
                            <p className="two-column"><Text strong>Còn nợ: </Text><Text type="danger">{formatUnit.moneyVN(consignment.outstanding_amount)}</Text></p>
                            <p className="two-column"><Text strong>Kho nhận hàng: </Text>{consignment.warehouse?.name}</p>
                            <p className="two-column"><Text strong>Mã vận đơn:</Text><Text mark>{consignment?.bol?.bol_code}</Text></p>

                        </div>
                    </Flex>


                </Flex>
                <Flex vertical className='detailBox' style={{ width: '500px' }}>
                    <h2 style={{ textAlign: 'center' }}>Lịch sử đơn hàng</h2>
                    <Timeline
                        mode='right'
                        items={histories.map((history) => {
                            const StatusTag = statusTagMapping[history.status];
                            return {
                                key: history.id,
                                label: `${formatDate(history.create_at)} ${history?.employee ? `by ${history.employee}` : ''}`,
                                children: <StatusTag />
                            }
                        })}
                        style={{ width: '100%' }}
                    />
                </Flex>
            </Flex>
        </div>
    )
}

export default ConsignmentDetail