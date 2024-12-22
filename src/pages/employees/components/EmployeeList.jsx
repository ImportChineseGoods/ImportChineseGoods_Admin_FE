import React, { useContext, useEffect, useState } from 'react';
import { Table, Button, Typography, Image, Space, Flex, notification, Popover, Modal, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import formatDate from '@helpers/formatDate';
import { AuthContext } from '@generals/contexts/authcontext';
import { employeeApi } from '@api/employeeApi';
import { render } from 'react-dom';
const { Text, Link } = Typography;

const EmployeeList = ({ data, total, loading, page, pageSize, onPageChange }) => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [employees, setEmployees] = useState(
        data.map((employee, index) => ({ ...employee, key: index + 1 }))
    );
    useEffect(() => {
        setEmployees(
            data.map((employee, index) => ({ ...employee, key: index + 1 }))
        );
    }, [data]);

    const isAdmin = auth?.user?.role === 'admin' || auth?.user?.role === 'accountant';

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
            width: '4%'
        },
        {
            title: 'Họ tên',
            dataIndex: 'name',
            width: '15%'
        },
        {
            title: 'Username',
            dataIndex: 'username',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'is_active',
            render: (isActive) => {
                return isActive ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Đã khóa</Tag>;
            }
        },
        {
            title: 'Thông tin',
            render: (_, record) => {
                return (
                    <Flex justify='space-between'>
                        <Flex vertical>
                            <Text>Email:</Text>
                            <Text>Điện thoại:</Text>
                            <Text>Ngày tạo:</Text>
                            <Text>Ngày cập nhật:</Text>
                        </Flex>
                        <Flex vertical justify='flex-end' style={{ textAlign: 'end' }}>
                            <Text>{record.email}</Text>
                            <Text>{record.phone}</Text>
                            <Text>{formatDate(record.create_at)}</Text>
                            <Text>{formatDate(record.update_at)}</Text>
                        </Flex>
                    </Flex>

                );
            }
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            render: (role) => {
                return role === 'admin' ? 'Quản lý' : role === 'accountant' ? 'Kế toán' : role === 'sales' ? 'Nhân viên bán hàng' : role === 'order' ? 'Nhân viên đặt hàng' : 'Nhân viên kho';
            }
        },
        isAdmin && {
            title: 'Thao tác',
            width: '100px',
            key: 'action',
            render: (_, record) => {
                const lock = record.is_active === true;
                return (
                    <Space size="middle" direction='vertical' align='center'>
                        {isAdmin && (
                            <Button color="primary" variant="filled" onClick={() => navigate(`/employees/update/${record.id}`)}>
                                Cập nhật
                            </Button>
                        )}
                        {lock ?
                            <Button
                                color="danger"
                                variant="filled"
                                onClick={() => Modal.confirm({
                                    title: 'Xác nhận',
                                    content: 'Bạn có chắc chắn muốn khóa tài khoản này?',
                                    okText: 'Khóa',
                                    cancelText: 'Hủy',
                                    onOk: () => handleLock(record.id),
                                })}>
                                Khóa
                            </Button> :
                            <Button color="danger" variant="filled" onClick={() => handleLock(record.id)}>
                                Mở khóa
                            </Button>
                        }

                    </Space >
                );
            },
        }
    ].filter(Boolean);

    const handleLock = async (id) => {
        const response = await employeeApi.lockEmployee(id);
        console.log(response);
        if (response?.status === 200) {
            notification.success({
                message: 'Cập nhật thành công',
            });
            setTimeout(() => {
                navigate(0);
            }, 1000);
        } else {
            notification.error({
                message: 'Cập nhật thất bại',
                description: response?.RM || 'Vui lòng thử lại.',
            });
        }
    }

    return (
        <Table
            columns={columns}
            bordered
            dataSource={employees}
            pagination={{
                current: page,
                pageSize: pageSize || 1000,
                total: total,
                onChange: (newPage, newPageSize) => onPageChange(newPage),
            }}
            loading={loading}
        />
    );
};

export default EmployeeList;
