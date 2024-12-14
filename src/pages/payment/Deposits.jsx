
import { getData } from '@api/getDataApi'
import { AuthContext } from '@generals/contexts/authcontext'
import { Typography, Breadcrumb, Card, Divider, QRCode, Flex } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const { Text } = Typography

function Deposits() {
  const { auth } = useContext(AuthContext);
  const [data, setData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const response = await getData.depositData()
      if (response.status === 200) {
        setData(response.data);
      } else {
        notification.error({
          message: 'Lỗi khi lấy dữ liệu',
          description: response?.RM || 'Vui lòng thử lại.',
        })
      }
    }
    fetchData()
  }, [])

  let hotline, bank, bank_account, bank_owner;
  data.forEach(item => {
    if (item.type === 'hotline') {
      hotline = item.value;
    } else if (item.type === 'bank') {
      bank = item.value;
    } else if (item.type === 'bank_account') {
      bank_account = item.value;
    } else if (item.type === 'bank_owner') {
      bank_owner = item.value;
    }
  });
  return (
    <div>
      <Breadcrumb
        items={[
          {
            title: <Link to="/">Trang chủ</Link>,
          },
          {
            title: 'Nạp tiền',
          },
        ]}
      />
      <Divider></Divider>
      <Flex vertical className='detailBox'>
        <h2>Thông tin nạp tiền</h2>
        <Text >Ngân hàng: {bank}</Text>
        <Text strong>Số tài khoản: {bank_account}</Text>
        <Text strong>Chủ tài khoản: {bank_owner}</Text>
        <Text>Nội dung: <Text keyboard>KHACH HANG {auth.user.id} NAP TIEN</Text></Text>

        <QRCode value='-' />
        <p>Sau khi chuyển tiền thành công, tiền sẽ được nạp vào ví của bạn trong vòng 24h</p>
        <Text strong>Hotline hỗ trợ: {hotline}</Text>
      </Flex>

    </div>
  )
}

export default Deposits