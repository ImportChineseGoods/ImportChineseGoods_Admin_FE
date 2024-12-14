import React, { useContext, useEffect, useState } from 'react';
import { DoubleRightOutlined, LaptopOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Divider, Flex, Layout, List, theme } from 'antd';
import { AuthContext } from '@generals/contexts/authcontext';
import { Link } from 'react-router-dom';
import { getData } from '@api/getDataApi';
import { formatUnit } from '@helpers/formatUnit';

const Homepage = () => {
  const { auth, appLoading, setAppLoading } = useContext(AuthContext);
  const [balance, setBalance] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [consignmentsCount, setConsignmentsCount] = useState(0);
  const [complaintsCount, setComplaintsCount] = useState(0);

  useEffect(() => {
    setAppLoading(true);
      getData.overviewData()
        .then((res) => {
          if (res.status === 200) {
            setBalance(res.data?.balance);
            setOrdersCount(res.data?.ordersCount);
            setConsignmentsCount(res.data?.consignmentsCount);
            setComplaintsCount(res.data?.complaintsCount);
          } else {
            notification.error({
              message: 'Lấy thông tin thất bại',
              description: res?.RM ?? "error"
            });
          }
        })
        .catch((err) => {
          console.error(err);
          notification.error({
            message: 'Lấy thông tin thất bại',
            description: err?.RM ?? "error"
          });
        })
        .finally(() => {
          setAppLoading(false);
        });
  }, []);

  const data = [
    {
      title: 'Số dư',
      icon: <LaptopOutlined />,
      content: `${formatUnit.moneyVN(balance)}`,
      link: '/transactions'
    },
    {
      title: 'Đơn đặt hàng',
      content: `${formatUnit.number(ordersCount)} đơn`,
      link: '/orders'
    },
    {
      title: 'Đơn ký gửi',
      content: `${formatUnit.number(consignmentsCount)} đơn`,
      link: '/consignments'
    },
    {
      title: 'Khiếu nại',
      content: `${formatUnit.number(complaintsCount)} khiếu nại`,
      link: '/complaints'
    },
  ];
  return (
    <>
      <Layout>
        <Breadcrumb
          items={[
            {
              title: <Link to="/">Trang chủ</Link>,
            },
            {
              title: 'Tổng quan',
            },
          ]}
          />
      <Divider></Divider>
        <List
          grid={{
            gutter: 16,
            column: 4,
          }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Card loading={appLoading} title={item.title} icon={item.icon}>
                <Flex style={{justifyContent: 'space-between'}}>
                  <p>{item.content}</p>
                  <Link to={item.link}>Xem thêm <DoubleRightOutlined /></Link>
                </Flex>
                
              </Card>
            </List.Item>
          )}
        />
      </Layout>
    </>
  );
};
export default Homepage;