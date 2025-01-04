import React, { useEffect, useState } from 'react';
import { Table, Button, notification, Space, Flex, Typography, Popover, Popconfirm, Modal, Select } from 'antd';
const { Text } = Typography;
import { useNavigate } from 'react-router-dom';
import statusTagMapping from './tag';
import Histories from './Histories';
import formatDate from '@helpers/formatDate';
import { bolApi } from '@api/bolApi';
import { formatUnit } from '@helpers/formatUnit';
import { adminData } from '@api/adminDataApi';

const WarehouseBOL = ({ data, total, loading, page, pageSize, onPageChange }) => {
    const navigate = useNavigate();
    const [bols, setBOLs] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [orders, setOrders] = useState([]);
    const [customer, setCustomer] = useState('');
    const [options, setOptions] = useState([]);
    useEffect(() => {
        if (data) {
            setBOLs(
                data.map((bol, index) => ({ ...bol, key: index + 1 }))
            );
        }
    }, [data]);

    const handleUndo = async (record) => {
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

    const handleSearchCustomer = async (value) => {
        const response = await adminData.getCustomer({ search: value });
        if (response.status === 200) {
            const customerOptions = response.data.map((item) => ({
                label: `${item.id} - ${item.name}`,
                value: item.id,
            }));
            setOptions(customerOptions);
        } else {
            notification.error({
                message: 'Lỗi khi tìm kiếm khách hàng',
                description: response?.RM || 'Không tìm thấy khách hàng',
            });
        }
    };

    const handleOrder = async () => {
        if (selectedRows.length === 0) {
            notification.error({
                message: 'Không có đơn vô danh nào được chọn',
                description: 'Vui lòng chọn đơn vô danh để gán',
            });
            return;
        }

        if (!customer) {
            notification.error({
                message: 'Chưa chọn khách hàng',
                description: 'Vui lòng chọn khách hàng để gán',
            });
            return;
        }

        const dataToSend = {
            customer_id: customer,
            bols: selectedRows,
        };

        const response = await bolApi.assignCustomer(dataToSend);
        if (response.status === 200) {
            notification.success({
                message: 'Gán khách hàng thành công',
                description: response?.RM || '',
            });
            setTimeout(() => {
                navigate(0);
            }, 500);

        } else {
            notification.error({
                message: 'Gán khách hàng thất bại',
                description: response?.RM || '',
            });
        }
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'key',
            rowScope: 'row',
            render: (text, record) => {
                page = page || 1;
                pageSize = pageSize || 1000;
                return (page - 1) * pageSize + record.key;
            },
        },
        {
            title: 'Mã vận đơn',
            dataIndex: 'bol_code',
        },
        {
            title: 'Mã khách hàng',
            render: (_, record) => record?.order?.customer_id || record?.consignment?.customer_id || '_',
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
                                content={<Histories data={record?.order?.histories || record?.consignment?.histories || record?.anonymous?.histories} />}
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
            render: (weight) => weight ? formatUnit.weight(weight) : '_',
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

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
            setSelectedRows(selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.order_id || record.consignment_id,   
            name: record.name,
        }),
    };

    return (
        <>
            <Flex gap='20px' align='center' justify='center' style={{ margin: '10px' }}>
                <p>Gán khách hàng: </p>
                <Select
                    showSearch
                    placeholder="Gán khách hàng"
                    filterOption={false}
                    onSearch={handleSearchCustomer}
                    onChange={(value) => setCustomer(value)}
                    options={options}
                    allowClear
                    style={{ width: 300 }}
                />
                <Button type="primary" onClick={handleOrder}>Gán</Button>
            </Flex>
                <Table
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={bols}
                    bordered
                    pagination={{
                        current: page,
                        pageSize: pageSize || 1000,
                        total: total,
                        onChange: (newPage, newPageSize) => onPageChange(newPage, newPageSize),
                    }}
                    loading={loading}
                />
            </>

            );
};

            export default WarehouseBOL;
