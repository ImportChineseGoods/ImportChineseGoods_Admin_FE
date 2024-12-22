import { parametersApi } from '@api/parameterApi';
import { formatUnit } from '@helpers/formatUnit';
import { Breadcrumb, Card, Divider, Flex, Typography, Input, Button, notification } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const { Text } = Typography;

function Parameters() {
    const [parameters, setParameters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingParams, setEditingParams] = useState({});

    const params = ['applicable_rate', 'original_rate', 'weight_fee', 'original_weight_fee']

    const fetchParameters = async () => {
        const response = await parametersApi.getAll();
        if (response.status === 200) {
            const paramMap = response.parameters.reduce((acc, param) => {
                acc[param.id] = param.value;
                return acc;
            }, {});
            setParameters(response.parameters);
            setEditingParams(paramMap);
        } else {
            notification.error({
                message: 'Lỗi khi lấy dữ liệu',
                description: response?.RM || 'Vui lòng thử lại.',
            });
        }
    }

    const handleSave = async (param) => {
        const updatedValue = editingParams[param.id];

        if (params.includes(param.type) && (isNaN(updatedValue) || updatedValue < 0)) {
            notification.error({
                message: `Lỗi khi cập nhật ${param.name}`,
                description: 'Giá trị phải là số không âm.',
            });
            return;
        } 
        
        const response = await parametersApi.update(param.id, { value: updatedValue });

        if (response.status === 200) {
            notification.success({
                message: 'Cập nhật thành công',
                description: `${param.name} đã được cập nhật.`,
            });
            fetchParameters();
        } else {
            notification.error({
                message: 'Lỗi khi cập nhật',
                description: response?.RM || 'Vui lòng thử lại.',
            });
        }
    }

    const handleChange = (id, value) => {
        setEditingParams((prev) => ({
            ...prev,
            [id]: value
        }));
    }

    useEffect(() => {
        setLoading(true);
        fetchParameters();
        setLoading(false);
    }, []);

    return (
        <div >
            <Breadcrumb
                items={[
                    {
                        title: <Link to="/">Trang chủ</Link>,
                    },
                    {
                        title: 'Thông số chung',
                    },
                ]}
            />
            <Divider></Divider>

            <Flex vertical className='detailBox' style={{width: '70%'}}>
                <h3>Thông số chung</h3>
                <Flex vertical gap='10px'>
                    {parameters.map((item, index) => (
                        <div key={index} className='two-column'>
                            <Text>{item.name}</Text>
                            <Flex align="center" gap="10px">
                                <Input
                                    value={editingParams[item.id]}
                                    onChange={(e) => handleChange(item.id, e.target.value)}
                                    style={{ width: 500 }}
                                />
                                <Button
                                    type="primary"
                                    onClick={() => handleSave(item)}
                                >
                                    Lưu
                                </Button>
                            </Flex>
                        </div>
                    ))}
                </Flex>
            </Flex>
        </div>
    )
}

export default Parameters;
