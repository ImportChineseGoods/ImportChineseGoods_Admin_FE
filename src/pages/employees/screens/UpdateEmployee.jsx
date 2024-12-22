import { employeeApi } from '@api/employeeApi';
import { Breadcrumb, Divider, notification } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import FormEmployee from '../../../generals/components/components/FormEmployee';

function UpdateEmployee() {
  const { employee_id } = useParams();
  const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchEmployee = async () => {
    const response = await employeeApi.getEmployee(employee_id);
    if (response.status === 200) {
      setEmployee(response.employee);
    } else {
      notification.error({
        message: 'Lỗi khi lấy dữ liệu',
        description: response?.RM || 'Vui lòng thử lại.',
      });
    }
  }

  const updateEmployee = async (data) => {
    const response = await employeeApi.updateEmployee(employee_id, data);
    if (response.status === 200) {
      notification.success({
        message: 'Cập nhật nhân viên thành công',
      });
    } else {
      notification.error({
        message: 'Cập nhật nhân viên thất bại',
        description: response?.RM || 'Vui lòng thử lại.',
      });
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchEmployee();
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
      <FormEmployee data={employee} handleSubmit={updateEmployee} loading={loading} setLoading={setEmployee}/>
    </div>
  )
}

export default UpdateEmployee