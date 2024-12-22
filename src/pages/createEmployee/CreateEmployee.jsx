import { employeeApi } from '@api/employeeApi';
import FormEmployee from '@components/components/FormEmployee';
import { Breadcrumb, Divider, notification } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, } from 'react-router-dom'


function CreateEmployee() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createEmployee = async (data) => {
    const response = await employeeApi.createEmployee(data);
    if (response.status === 200) {
      notification.success({
        message: 'Thêm mới nhân viên thành công',
      });

      setTimeout(() => {
        navigate('/employees');
      }, 1000);
    } else {
      notification.error({
        message: 'Thêm mới nhân viên thất bại',
        description: response?.RM || 'Vui lòng thử lại.',
      });
    }

  }

  useEffect(() => {
    setLoading(true);
    setLoading(false);
  }, []);

  return (
    <div>
      <Breadcrumb
        items={[
          {
            title: <Link to="/">Trang chủ</Link>,
          },
          {
            title: 'Cập nhật nhân viên',
          },

        ]}
      />
      <Divider />
      <FormEmployee data={null} handleSubmit={createEmployee} loading={loading} />
    </div>
  )
}

export default CreateEmployee;