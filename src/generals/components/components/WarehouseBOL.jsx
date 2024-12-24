import React, { useEffect, useState } from 'react';
import { Table, Button, notification, Space, Flex, Typography, Popover, Popconfirm, Modal } from 'antd';
const { Text } = Typography;
import { useNavigate } from 'react-router-dom';
import statusTagMapping from './tag';
import Histories from './Histories';
import formatDate from '@helpers/formatDate';
import { bolApi } from '@api/bolApi';

const WarehouseBOL = ({ data }) => {
    const navigate = useNavigate();
    const [bols, setBOLs] = useState([]);
    useEffect(() => {
        console.log('data:', data);
        if (data) {
            setBOLs(
                data.map((bol, index) => ({ ...bol, key: index + 1 }))
            );
        }
    }, [data]);

    console.log('bols:', bols);

    const handleUndo = async (record) => {
        console.log('record:', record);
        const response = await bolApi.undoBOL(record.bol_code);
        if (response?.status === 200) {
            notification.success({
                message: response?.RM || 'Hủy nhập kho thành công',
            });

            setBOLs((prevBOLs) => {
                return prevBOLs.filter(bol => bol.bol_code !== record.bol_code);
            });
        } else {
            notification.error({
                message: 'Hủy nhập kho thất bại',
                description: response?.RM || 'Vui lòng thử lại.',
            });
        }
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'key',
            rowScope: 'row',
        },
        {
            title: 'Mã vận đơn',
            dataIndex: 'bol_code',
        },
        {
            title: 'Mã đơn hàng',
            render: (_, record) => record.order_id || record.consignment_id || record.anonymous_id,
        },
        {
            title: 'Loại đơn',
            render: (_, record) => {
                if (record.order_id) return 'Đơn đặt hàng hộ';
                if (record.consignment_id) return 'Đơn ký gửi';
                if (record.anonymous_id) return 'Đơn vô danh';
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
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
        },
        {
            title: 'Cân nặng (kg)',
            dataIndex: 'weight',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => {
                const visible = record.status === 'shop_shipping';
                return (
                    <Space size="middle">
                        <Button color="danger" variant="filled" onClick={() => {
                            Modal.confirm({
                                title: `Xác nhân hủy đơn hàng ${record.id}`,
                                content: 'Thao tác này không thể hoànn tác. Bạn có chắc chắn muốn hủy đơn hàng này?',
                                okText: 'Xác nhận',
                                cancelText: 'Đóng',
                                footer: (_, { OkBtn, CancelBtn }) => (
                                    <>
                                        <CancelBtn />
                                        <OkBtn />
                                    </>
                                ),
                                onOk: () => handleUndo(record),
                            });
                        }}>
                            Hủy
                        </Button>
                    </Space>
                );
            },
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={bols}
            bordered
        />
    );
};

export default WarehouseBOL;
