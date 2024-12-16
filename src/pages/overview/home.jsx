import React, { useContext, useEffect, useState } from 'react';
import { DoubleRightOutlined, LaptopOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Divider, Flex, Layout, List, notification } from 'antd';
import { AuthContext } from '@generals/contexts/authcontext';
import { Link } from 'react-router-dom';
import { adminData } from '@api/adminDataApi';
import { formatUnit } from '@helpers/formatUnit';
import { use } from 'react';

const Homepage = () => {
  const { auth, appLoading, setAppLoading } = useContext(AuthContext);
  const [dataOverview, setDataOverview] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    setAppLoading(true);
    adminData.overviewData()
      .then((res) => {
        if (res.status === 200) {
          setDataOverview(res.data);
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

 useEffect(() => {
    if (dataOverview && auth.user.role !== 'warehouse') {
      const { ordersCount, consignmentsCount, complaintsCount, dailyRevenue } = dataOverview;
      setData([
        {
          title: 'Doanh thu ngày',
          icon: <LaptopOutlined />,
          content: `${formatUnit.moneyVN(dailyRevenue)}`,
          link: '/transactions'
        },
        {
          title: 'Đơn đặt hàng chờ xử lý',
          content: `${formatUnit.number(ordersCount)} đơn`,
          link: '/orders'
        },
        {
          title: 'Đơn ký gửi chờ xử lý',
          content: `${formatUnit.number(consignmentsCount)} đơn`,
          link: '/consignments'
        },
        {
          title: 'Khiếu nại chờ xử lý',
          content: `${formatUnit.number(complaintsCount)} khiếu nại`,
          link: '/complaints'
        },
      ])
    } else if (dataOverview && auth.user.role === 'warehouse') {
      const { deliveryNoteCount, warehouseVN, warehouseTQ } = dataOverview;
      setData([
        {
          title: 'Phiếu xuất hàng chưa xuất',
          content: `${formatUnit.number(deliveryNoteCount)} phiếu`,
          link: '/delivery-notes'
        },
        {
          title: 'Kho Việt Nam',
          content: `${formatUnit.number(warehouseVN)} đơn`,
          link: '/warehouse-vn/manageBol'
        },
        {
          title: 'Kho Trung Quốc',
          content: `${formatUnit.number(warehouseTQ)} đơn`,
          link: '/warehouse-tq/manageBol'
        },
      ])
    }
  }, [dataOverview]);

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
                <Flex style={{ justifyContent: 'space-between' }}>
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